(() => {
    function syncControllers() {
        if (!window.PresentationController) {
            setTimeout(syncControllers, 200);
            return;
        }

        window.EventController = {
            start: window.PresentationController.start,
            next: window.PresentationController.next,
            previous: window.PresentationController.previous,
            goToCountry: window.PresentationController.goToCountry,
            pause: window.PresentationController.pauseForEmergency,
            resume: window.PresentationController.resumeFromEmergency,
            restart: window.PresentationController.restart
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncControllers);
    } else {
        syncControllers();
    }
})();