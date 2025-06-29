<<<<<<< HEAD
# maryse-boko
=======
# Freelance Portfolio Website

A modern, responsive portfolio website built with pure HTML, CSS, and JavaScript, featuring a PHP backend for contact form handling.

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Modern Animations**: Smooth transitions, parallax effects, and scroll-triggered animations
- **Interactive Elements**: Hover effects, testimonial carousel, project filtering
- **Performance Optimized**: Lazy loading, debounced scroll handlers, and optimized assets
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **SEO Friendly**: Meta tags, structured data, and optimized content

### Backend
- **Secure Contact Form**: Input validation, sanitization, and spam detection
- **Rate Limiting**: Prevents abuse with configurable limits
- **Email Integration**: Sends formatted emails with form submissions
- **Error Handling**: Comprehensive logging and error responses
- **Security Headers**: XSS protection, content type validation

## Project Structure

```
/
├── index.html          # Homepage with hero, services, and recent projects
├── about.html          # About page with bio, timeline, and testimonials
├── projects.html       # Portfolio showcase with filtering and modals
├── services.html       # Service offerings with detailed descriptions
├── contact.html        # Contact form with validation
├── css/
│   └── styles.css      # Complete stylesheet with responsive design
├── js/
│   └── main.js         # JavaScript functionality and interactions
├── backend/
│   └── contact.php     # PHP contact form handler
└── README.md           # This file
```

## Design System

### Colors
- **Primary**: #1ABC9C (Turquoise)
- **Secondary**: #E67E22 (Sunset Orange)
- **Light Gray**: #ECF0F1
- **White**: #FFFFFF
- **Dark Gray**: #2C3E50

### Typography
- **Headings**: Montserrat (Bold)
- **Body Text**: Open Sans (Regular)
- **Line Heights**: 150% for body, 120% for headings

### Spacing
- Uses 8px spacing system
- CSS custom properties for consistent spacing
- Responsive adjustments for mobile devices

## Installation & Setup

### Requirements
- Web server with PHP support (Apache/Nginx)
- PHP 7.4 or higher
- Mail server configuration for contact form

### Local Development
1. Clone or download the project files
2. Place files in your web server directory
3. Configure PHP mail settings
4. Update email addresses in `backend/contact.php`
5. Open `index.html` in your browser

### Production Deployment
1. Upload all files to your web hosting
2. Ensure PHP is enabled
3. Configure mail settings with your hosting provider
4. Update contact email in `backend/contact.php`
5. Test contact form functionality

## Configuration

### Contact Form Setup
Edit `backend/contact.php` and update:

```php
$config = [
    'to_email' => 'your-email@domain.com',
    'from_email' => 'noreply@yourdomain.com',
    'subject_prefix' => '[Portfolio Contact] ',
    // ... other settings
];
```

### Customization
- **Colors**: Update CSS custom properties in `styles.css`
- **Content**: Replace placeholder text and images
- **Images**: Use your own images or update Pexels URLs
- **Social Links**: Update footer social media links

## Features Breakdown

### Homepage (index.html)
- Hero section with parallax background
- Animated text with staggered fade-in effects
- Services grid with hover animations
- Recent projects showcase
- Smooth scroll navigation

### About Page (about.html)
- Circular profile image with border effects
- Interactive timeline with alternating layout
- Testimonials carousel with navigation
- Skills tags with modern styling

### Projects Page (projects.html)
- Filterable project grid
- Hover effects with overlay information
- Modal popups with detailed project information
- Technology tags and project links

### Services Page (services.html)
- Detailed service cards with pricing
- Process timeline visualization
- Call-to-action section
- Scroll-triggered animations

### Contact Page (contact.html)
- Comprehensive contact form with validation
- Real-time field validation
- AJAX form submission
- Success/error feedback
- Contact information display

## JavaScript Functionality

### Core Features
- **Navigation**: Mobile menu, active link highlighting, scroll effects
- **Animations**: Intersection Observer for scroll animations
- **Form Handling**: Validation, AJAX submission, error handling
- **Interactive Elements**: Testimonial carousel, project filters, modals
- **Performance**: Debounced scroll handlers, lazy loading

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Graceful degradation of advanced features

## PHP Backend Features

### Security Measures
- Input validation and sanitization
- Rate limiting to prevent spam
- Spam detection algorithms
- Security headers
- Error logging

### Email Functionality
- Formatted email templates
- Reply-to header configuration
- Attachment support (if needed)
- Delivery confirmation

## Performance Optimizations

### Frontend
- Minified CSS and JavaScript (for production)
- Optimized images with proper sizing
- Lazy loading for images
- Debounced scroll events
- Efficient DOM queries

### Backend
- Rate limiting with file-based storage
- Efficient validation algorithms
- Proper error handling
- Log rotation for maintenance

## Browser Compatibility

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Fallbacks
- CSS Grid with Flexbox fallback
- Modern JavaScript with polyfills
- Progressive enhancement approach

## Maintenance

### Regular Tasks
- Update contact form logs
- Monitor spam detection
- Update project portfolio
- Refresh testimonials
- Check broken links

### Security Updates
- Keep PHP updated
- Monitor for vulnerabilities
- Update dependencies
- Review access logs

## Customization Guide

### Adding New Projects
1. Add project data to `js/main.js` in the `projectData` object
2. Add project card HTML to `projects.html`
3. Include appropriate category for filtering

### Modifying Styles
1. Update CSS custom properties for global changes
2. Use existing utility classes when possible
3. Follow mobile-first responsive design
4. Test across different devices

### Extending Functionality
1. Follow existing code patterns
2. Use modern JavaScript features
3. Implement proper error handling
4. Add appropriate comments

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the code comments for implementation details
2. Review browser console for JavaScript errors
3. Check PHP error logs for backend issues
4. Ensure proper server configuration

---

Built with modern web technologies and best practices for optimal performance and user experience.
>>>>>>> 390693c (Initial)
