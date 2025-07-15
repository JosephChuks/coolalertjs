# 🚀 CoolAlertJS

**CoolAlertJS** is a powerful, modern, and ultra-lightweight replacement for native JavaScript popup boxes. Featuring stunning glassmorphism design, smooth animations, and drag-and-drop functionality, it seamlessly incorporates both modal dialogs and toast notifications. Built for developers who demand beauty, performance, and ease of use.

✨ **Zero dependencies** • 🎨 **Glassmorphism design** • 📱 **Fully responsive** • 🎯 **Promise-based API** • 🖱️ **Draggable modals** • ⚡ **Lightning fast**

---

## 🎯 Features

- **🎨 Modern Design**: Beautiful glassmorphism effects with vibrant gradients
- **🖱️ Draggable Modals**: Smooth drag-and-drop functionality with visual feedback
- **🍞 Toast Notifications**: Non-intrusive toast messages with customizable positions
- **📱 Responsive**: Perfect on all devices and screen sizes
- **⚡ Promise-Based**: Clean async/await support just like SweetAlert
- **🎭 Rich Animations**: Smooth transitions and engaging micro-interactions
- **🎛️ Highly Customizable**: Extensive options for every use case
- **🪶 Lightweight**: < 15KB gzipped, zero dependencies
- **♿ Accessible**: Full keyboard navigation and screen reader support
- **🔧 Developer Friendly**: Simple API with TypeScript support

---

## 📦 Installation

### NPM
```bash
npm install coolalertjs
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/coolalertjs@latest/dist/coolalert.min.js"></script>
```

### Download
Download the latest release from [GitHub](https://github.com/JosephChuks/coolalertjs/releases)

---

## 🚀 Quick Start

### Basic Usage
```javascript
// Simple alert
CoolAlert.show('This is a basic alert');

// Success message
CoolAlert.show({
    icon: 'success',
    title: 'Great!',
    text: 'Everything worked perfectly!'
});
```

### Promise-Based Confirmation
```javascript
CoolAlert.show({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
}).then((result) => {
    if (result.isConfirmed) {
        CoolAlert.show('Deleted!', 'Your file has been deleted.', 'success');
    }
});
```

### Toast Notifications
```javascript
// Quick toast
CoolAlert.show({
    toast: true,
    icon: 'success',
    text: 'Settings saved successfully!',
    position: 'top-right'
});
```

### Advanced with PreConfirm
```javascript
CoolAlert.show({
    title: 'Submit your data?',
    icon: 'question',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network error');
        return response.json();
    }
}).then((result) => {
    if (result.isConfirmed) {
        CoolAlert.show('Success!', 'Data submitted successfully', 'success');
    }
});
```

---

## 🎨 Available Icons

- `success` ✓
- `error` ✕  
- `warning` ⚠
- `info` ℹ
- `question` ?

---

## 📋 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `''` | Title of the modal |
| `text` | string | `''` | Text to be displayed in the modal |
| `html` | string | `''` | HTML content to be displayed in the modal |
| `icon` | string | `'info'` | Icon type (success, error, warning, info, question) |
| `showConfirmButton` | boolean | `true` | Show confirm button or not |
| `confirmButtonText` | string | `'Continue'` | Text for confirm button |
| `confirmButtonColor` | string | `'#6c5ce7'` | Color of confirm button |
| `showDenyButton` | boolean | `false` | Show deny button or not |
| `denyButtonText` | string | `'Deny'` | Text for deny button |
| `denyButtonColor` | string | `'#b00'` | Color of deny button |
| `showCancelButton` | boolean | `true` | Show cancel button or not |
| `cancelButtonText` | string | `'Cancel'` | Text for cancel button |
| `cancelButtonColor` | string | `'rgba(255, 255, 255, 0.1)'` | Color of cancel button |
| `showCloseIcon` | boolean | `false` | Show close icon or not |
| `toast` | boolean | `false` | Show toast instead of modal |
| `position` | string | `'top-right'` | Position of toast |
| `draggable` | boolean | `false` | Enable dragging of the modal |
| `preConfirm` | function | `null` | Function to execute before confirming |
| `allowOutsideClick` | boolean/function | `true` | Allow modal to be closed outside of it |

### Toast Positions
- `top-left`
- `top-right` (default)
- `bottom-left`
- `bottom-right`
- `top-center`
- `bottom-center`

---

## 🎯 API Methods

### `CoolAlert.show(options)`
Main method to display alerts. Returns a Promise.

```javascript
// String parameter (simple alert)
CoolAlert.show('Hello World!');

// Object parameter (full options)
CoolAlert.show({
    title: 'Custom Alert',
    text: 'This is customizable!',
    icon: 'info'
});
```

### `CoolAlert.isLoading()`
Check if a preConfirm operation is currently running.

```javascript
if (CoolAlert.isLoading()) {
    console.log('Still processing...');
}
```

### `CoolAlert.initializeStyles(config)`
Override default styling with custom configuration.

```javascript
CoolAlert.initializeStyles({
    overlay: "rgba(0, 0, 0, 0.8)",
    background: "#011627",
    primary: "#6c5ce7",
    secondary: "rgba(255, 255, 255, 0.1)",
    success: "#089f4d",
    warning: "#ff8513",
    info: "#74b9ff",
    error: "#b00",
    question: "#d89f04",
    text: "rgba(255, 255, 255, 0.9)",
    title: "rgba(255, 255, 255, 0.9)",
    closeBtn: "rgba(255, 255, 255, 0.7)"
});
```

---

## 🎨 Theming & Customization

### Custom Styling Configuration
```javascript
CoolAlert.initializeStyles({
    overlay: "rgba(0, 0, 0, 0.8)",
    background: "#011627",
    primary: "#6c5ce7",
    secondary: "rgba(255, 255, 255, 0.1)",
    success: "#089f4d",
    warning: "#ff8513",
    info: "#74b9ff",
    error: "#b00",
    question: "#d89f04",
    text: "rgba(255, 255, 255, 0.9)",
    title: "rgba(255, 255, 255, 0.9)",
    closeBtn: "rgba(255, 255, 255, 0.7)"
});
```

### Advanced CSS Customization
```css
/* Override specific components */
.cool-alert-modal {
    border-radius: 15px;
    backdrop-filter: blur(25px);
}

.cool-alert-modal-btn.my-custom-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    border-radius: 50px;
}
```

---

## 🎭 Result Object

The Promise resolves with a result object:

```javascript
{
    isConfirmed: boolean,    // true if user clicked confirm
    isDenied: boolean,       // true if user clicked deny
    isDismissed: boolean,    // true if modal was dismissed
    value: any,              // result from preConfirm function
    dismiss: string          // dismissal reason ('cancel', 'close', 'outside')
}
```

---

## 🌟 Examples

### Complete Example with All Options
```javascript
CoolAlert.show({
    icon: "success",
    title: "WELCOME",
    text: "Login to proceed",
    html: '',
    
    showConfirmButton: false,
    confirmButtonText: "Proceed",
    confirmButtonColor: "#6c5ce7",
    
    showDenyButton: true,
    denyButtonText: "Deny",
    denyButtonColor: "#b00",
    
    showCancelButton: false,
    cancelButtonText: "Cancel",
    cancelButtonColor: "rgba(255, 255, 255, 0.1)",
    
    showCloseIcon: false,
    
    toast: true,
    position: "top-right",
    
    draggable: true,
    
    preConfirm: () => {
        return fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .catch(error => {
            throw new Error('Error: ' + error.message);
        });
    },
    allowOutsideClick: () => !CoolAlert.isLoading()
    
}).then((result) => {
    console.log(result);
    if (result.isConfirmed) {
        CoolAlert.show({
            title: result.value.title,
            text: result.value.title,
            icon: "error",
            toast: "bottom-left"
        });
    }
    
    if (result.isDenied) {
        CoolAlert.show({
            title: "Denied",
            text: "Changes not saved",
            icon: "error",
        });
    }
});
```

### Draggable Modal
```javascript
CoolAlert.show({
    title: 'Drag me around!',
    text: 'This modal is draggable',
    icon: 'info',
    draggable: true,
    showCancelButton: true
});
```

### Toast with Custom Position
```javascript
CoolAlert.show({
    toast: true,
    position: 'bottom-left',
    icon: 'success',
    title: 'Success!',
    text: 'Operation completed'
});
```

### Three-Button Modal
```javascript
CoolAlert.show({
    title: 'Save your changes?',
    text: 'Your changes will be lost if you don\'t save them.',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Save',
    denyButtonText: 'Don\'t save',
    cancelButtonText: 'Cancel'
}).then((result) => {
    if (result.isConfirmed) {
        CoolAlert.show('Saved!', '', 'success');
    } else if (result.isDenied) {
        CoolAlert.show('Changes are not saved', '', 'info');
    }
});
```

---

## 📱 Browser Support

CoolAlertJS works on all modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Migration from SweetAlert

CoolAlertJS is designed to be a drop-in replacement for SweetAlert2:

```javascript
// SweetAlert2
Swal.fire('Hello world!');

// CoolAlertJS
CoolAlert.show('Hello world!');
```

Most SweetAlert2 options work directly with CoolAlertJS!

---

## 📚 Documentation

For complete documentation, advanced examples, and interactive demos, visit:

**🌐 [www.coolalertjs.com](https://www.coolalertjs.com)**

---

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/JosephChuks/coolalertjs.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by SweetAlert2's API design
- Icons from various open-source icon libraries
- Community feedback and contributions

---

## 📞 Support

- 📖 **Documentation**: [www.coolalertjs.com](https://www.coolalertjs.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/JosephChuks/coolalertjs/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/JosephChuks/coolalertjs/discussions)
- 📧 **Email**: support@coolalertjs.com

---

## ⭐ Show Your Support

If CoolAlertJS helped you, please consider giving it a ⭐ on [GitHub](https://github.com/JosephChuks/coolalertjs)!

---

<div align="center">

**Made with ❤️ for developers**

[Website](https://www.coolalertjs.com) • [Documentation](https://www.coolalertjs.com/#) • [Examples](https://www.coolalertjs.com/#examples) • [GitHub](https://github.com/JosephChuks/coolalertjs)

</div>