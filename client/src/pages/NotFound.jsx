import React from 'react'

const NotFound = () => {
    return (
        <div style={{  height: "100vh",  display: "flex",  alignItems: "center",  justifyContent: "center", animation: "spin 3s linear infinite" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "colorChange 3s linear infinite" }}>
            <h1 style={{ animation: "colorChange 3s linear infinite" }}>404</h1>
            <h3 style={{ animation: "colorChange 3s linear infinite" }}>Page Not Found</h3>
            </div>
        </div>
    )
}

// Add a CSS rule for the spin animation
const styles = document.createElement('style');
styles.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes colorChange {
  0% { color: GrayText; }
  25% { color: red; }
  50% { color: green; }
  75% { color: blue; }
  100% { color: GrayText; }
}`;
document.head.appendChild(styles);

export default NotFound;
