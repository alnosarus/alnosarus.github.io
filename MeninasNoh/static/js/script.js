const painting = document.getElementById('painting');

const eyes = document.querySelectorAll('.eye');
const pupils = document.querySelectorAll('.pupil');
const eyeContainers = document.querySelectorAll('.eye-container');

function moveEye(eye, pupil, e) {
    const eyeRect = eye.getBoundingClientRect();
    const pupilRect = pupil.getBoundingClientRect();

    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    
    const angle = Math.atan2(deltaY, deltaX);
    
    const maxPupilOffset = (eyeRect.width - pupilRect.width) / 2;
    
    const mouseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const pupilDistance = Math.min(mouseDistance / 15, maxPupilOffset);
    
    const pupilX = Math.cos(angle) * pupilDistance;
    const pupilY = Math.sin(angle) * pupilDistance;
    
    pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
}

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < eyes.length; i++) {
        moveEye(eyes[i], pupils[i], e);
    }
});

function blink() {
    eyes.forEach(eye => {
        eye.classList.add('blinking');
        setTimeout(() => {
            eye.classList.remove('blinking');
        }, 150);
    });
    
    const nextBlink = Math.random() * 4000 + 2000;
    setTimeout(blink, nextBlink);
}

setTimeout(blink, 2000);



const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('is-hidden');
        } else {
            entry.target.classList.add('is-hidden');
        }
    });
}, { threshold: 0 });

eyeContainers.forEach(eyeContainer => {
    observer.observe(eyeContainer);
});

//Video Part

const video = document.getElementById('videoElement');
        const errorDiv = document.getElementById('error');

        // Set your desired effects here
        const SATURATION = 150; // percentage (100 = normal, 150 = 1.5x saturation)
        const BLUR = 0.3; // pixels

        let stream = null;

        async function startCamera() {
            try {
                errorDiv.style.display = 'none';
                
                // Stop existing stream if any
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                // Request camera access
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 600 },
                        height: { ideal: 300 }
                    } 
                });
                
                video.srcObject = stream;
                
                // Apply effects
                video.style.filter = `saturate(${SATURATION / 100}) blur(${BLUR}px)`;
            } catch (err) {
                console.error('Error accessing camera:', err);
                errorDiv.textContent = 'Unable to access camera. Please ensure you have granted camera permissions.';
                errorDiv.style.display = 'block';
            }
        }

        // Auto-start camera on load
        startCamera();

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });