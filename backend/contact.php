<?php
/**
 * Gestionnaire de formulaire de contact pour Maryse BOKO
 * 
 * Ce script gère les soumissions du formulaire de contact
 * Fonctionnalités : Validation, sécurisation, envoi d'email et mesures de sécurité
 */

// En-têtes de sécurité
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// En-têtes CORS (ajuster l'origine selon les besoins)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoriser uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Configuration
$config = [
    'to_email' => 'maryse@creativevoice.fr', // Changer par votre email
    'from_email' => 'noreply@creativevoice.fr', // Changer par votre domaine
    'subject_prefix' => '[Portfolio Contact] ',
    'max_message_length' => 5000,
    'rate_limit' => [
        'enabled' => true,
        'max_attempts' => 5,
        'time_window' => 3600 // 1 heure
    ]
];

// Limitation de débit
if ($config['rate_limit']['enabled']) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_limit_file = sys_get_temp_dir() . '/contact_rate_limit_' . md5($ip);
    
    if (file_exists($rate_limit_file)) {
        $attempts = json_decode(file_get_contents($rate_limit_file), true);
        $current_time = time();
        
        // Nettoyer les anciennes tentatives
        $attempts = array_filter($attempts, function($timestamp) use ($current_time, $config) {
            return ($current_time - $timestamp) < $config['rate_limit']['time_window'];
        });
        
        if (count($attempts) >= $config['rate_limit']['max_attempts']) {
            http_response_code(429);
            echo json_encode(['error' => 'Trop de requêtes. Veuillez réessayer plus tard.']);
            exit();
        }
        
        $attempts[] = $current_time;
    } else {
        $attempts = [time()];
    }
    
    file_put_contents($rate_limit_file, json_encode($attempts));
}

// Récupérer et décoder l'entrée JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Si le décodage JSON échoue, essayer de récupérer les données POST
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
}

// Fonction de validation
function validateInput($data) {
    $errors = [];
    
    // Champs requis
    $required_fields = ['prenom', 'nom', 'email', 'service-type', 'message'];
    foreach ($required_fields as $field) {
        if (empty($data[$field]) || trim($data[$field]) === '') {
            $errors[] = ucfirst(str_replace('-', ' ', $field)) . ' est requis.';
        }
    }
    
    // Validation email
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Veuillez saisir une adresse email valide.';
    }
    
    // Validation prénom/nom
    foreach (['prenom', 'nom'] as $field) {
        if (!empty($data[$field])) {
            if (strlen(trim($data[$field])) < 2) {
                $errors[] = ucfirst($field) . ' doit contenir au moins 2 caractères.';
            }
            if (strlen(trim($data[$field])) > 50) {
                $errors[] = ucfirst($field) . ' doit contenir moins de 50 caractères.';
            }
            if (!preg_match('/^[a-zA-ZÀ-ÿ\s\-\'\.]+$/u', trim($data[$field]))) {
                $errors[] = ucfirst($field) . ' contient des caractères non valides.';
            }
        }
    }
    
    // Validation message
    if (!empty($data['message'])) {
        if (strlen(trim($data['message'])) < 20) {
            $errors[] = 'Le message doit contenir au moins 20 caractères.';
        }
        if (strlen(trim($data['message'])) > 5000) {
            $errors[] = 'Le message doit contenir moins de 5000 caractères.';
        }
    }
    
    // Validation téléphone (si fourni)
    if (!empty($data['telephone']) && !preg_match('/^[\+]?[1-9][\d\s\-\(\)\.]{8,15}$/', preg_replace('/[\s\-\(\)]/', '', $data['telephone']))) {
        $errors[] = 'Veuillez saisir un numéro de téléphone valide.';
    }
    
    return $errors;
}

// Nettoyer les données
function sanitizeInput($data) {
    $sanitized = [];
    
    $sanitized['prenom'] = htmlspecialchars(trim($data['prenom']), ENT_QUOTES, 'UTF-8');
    $sanitized['nom'] = htmlspecialchars(trim($data['nom']), ENT_QUOTES, 'UTF-8');
    $sanitized['email'] = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $sanitized['telephone'] = isset($data['telephone']) ? htmlspecialchars(trim($data['telephone']), ENT_QUOTES, 'UTF-8') : '';
    $sanitized['entreprise'] = isset($data['entreprise']) ? htmlspecialchars(trim($data['entreprise']), ENT_QUOTES, 'UTF-8') : '';
    $sanitized['service_type'] = isset($data['service-type']) ? htmlspecialchars(trim($data['service-type']), ENT_QUOTES, 'UTF-8') : '';
    $sanitized['budget'] = isset($data['budget']) ? htmlspecialchars(trim($data['budget']), ENT_QUOTES, 'UTF-8') : '';
    $sanitized['echeance'] = isset($data['echeance']) ? htmlspecialchars(trim($data['echeance']), ENT_QUOTES, 'UTF-8') : '';
    $sanitized['message'] = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
    $sanitized['newsletter'] = isset($data['newsletter']) ? true : false;
    
    return $sanitized;
}

// Détection de spam
function detectSpam($data) {
    $spam_indicators = [
        'viagra', 'cialis', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'act now', 'limited time', 'make money', 'work from home',
        'free money', 'guaranteed', 'no obligation', 'risk free', 'bitcoin',
        'cryptocurrency', 'investment opportunity'
    ];
    
    $text = strtolower($data['prenom'] . ' ' . $data['nom'] . ' ' . $data['message']);
    
    foreach ($spam_indicators as $indicator) {
        if (strpos($text, $indicator) !== false) {
            return true;
        }
    }
    
    // Vérifier les liens excessifs
    if (preg_match_all('/https?:\/\//', $data['message']) > 2) {
        return true;
    }
    
    // Vérifier les majuscules excessives
    if (strlen($data['message']) > 50 && 
        strlen(preg_replace('/[^A-Z]/', '', $data['message'])) / strlen($data['message']) > 0.5) {
        return true;
    }
    
    return false;
}

// Fonction d'envoi d'email
function sendEmail($data, $config) {
    $to = $config['to_email'];
    $subject = $config['subject_prefix'] . 'Nouveau message de ' . $data['prenom'] . ' ' . $data['nom'];
    
    // Créer le corps de l'email
    $body = "✨ Nouveau message depuis le portfolio !\n\n";
    $body .= "👤 CONTACT\n";
    $body .= "Prénom : " . $data['prenom'] . "\n";
    $body .= "Nom : " . $data['nom'] . "\n";
    $body .= "Email : " . $data['email'] . "\n";
    
    if (!empty($data['telephone'])) {
        $body .= "Téléphone : " . $data['telephone'] . "\n";
    }
    
    if (!empty($data['entreprise'])) {
        $body .= "Entreprise : " . $data['entreprise'] . "\n";
    }
    
    $body .= "\n🎯 PROJET\n";
    
    if (!empty($data['service_type'])) {
        $services = [
            'voiceover' => '🎤 Voix-off',
            'community' => '💬 Community Management',
            'digital' => '✨ Communication Digitale',
            'formation' => '📚 Formation',
            'conseil' => '💡 Conseil & Stratégie',
            'autre' => '🌟 Autre projet créatif'
        ];
        $body .= "Service : " . ($services[$data['service_type']] ?? $data['service_type']) . "\n";
    }
    
    if (!empty($data['budget'])) {
        $body .= "Budget : " . $data['budget'] . "\n";
    }
    
    if (!empty($data['echeance'])) {
        $echeances = [
            'urgent' => '🚨 Urgent (sous 48h)',
            'semaine' => '📅 Cette semaine',
            'mois' => '🗓️ Ce mois-ci',
            'trimestre' => '⏰ Dans les 3 mois',
            'flexible' => '🌸 Flexible'
        ];
        $body .= "Échéance : " . ($echeances[$data['echeance']] ?? $data['echeance']) . "\n";
    }
    
    $body .= "\n💬 MESSAGE\n" . $data['message'] . "\n\n";
    
    if ($data['newsletter']) {
        $body .= "📧 Souhaite recevoir la newsletter\n\n";
    }
    
    $body .= "---\n";
    $body .= "📅 Envoyé le : " . date('d/m/Y à H:i:s') . "\n";
    $body .= "🌐 IP : " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "🖥️ User Agent : " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    
    // En-têtes email
    $headers = [
        'From: ' . $config['from_email'],
        'Reply-To: ' . $data['email'],
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit'
    ];
    
    return mail($to, $subject, $body, implode("\r\n", $headers));
}

// Fonction de log pour le débogage
function logMessage($message, $level = 'INFO') {
    $log_file = sys_get_temp_dir() . '/contact_form.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] [$level] $message\n";
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// Traitement principal
try {
    // Valider les données
    $validation_errors = validateInput($data);
    if (!empty($validation_errors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation échouée', 'details' => $validation_errors]);
        logMessage('Validation échouée : ' . implode(', ', $validation_errors), 'WARNING');
        exit();
    }
    
    // Nettoyer les données
    $clean_data = sanitizeInput($data);
    
    // Détection de spam
    if (detectSpam($clean_data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Message signalé comme spam']);
        logMessage('Spam détecté depuis l\'IP : ' . $_SERVER['REMOTE_ADDR'], 'WARNING');
        exit();
    }
    
    // Envoyer l'email
    if (sendEmail($clean_data, $config)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Merci pour votre message ! Je reviens vers vous très rapidement (généralement sous 2h) 💖'
        ]);
        logMessage('Email envoyé avec succès depuis : ' . $clean_data['email']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Échec de l\'envoi de l\'email. Veuillez réessayer plus tard.']);
        logMessage('Échec de l\'envoi de l\'email depuis : ' . $clean_data['email'], 'ERROR');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Une erreur inattendue s\'est produite']);
    logMessage('Exception : ' . $e->getMessage(), 'ERROR');
}

// Nettoyer les anciens fichiers de limitation de débit (exécuter occasionnellement)
if (rand(1, 100) === 1) {
    $temp_dir = sys_get_temp_dir();
    $files = glob($temp_dir . '/contact_rate_limit_*');
    $current_time = time();
    
    foreach ($files as $file) {
        if (($current_time - filemtime($file)) > 86400) { // 24 heures
            unlink($file);
        }
    }
}
?>