document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("presentationRoot");
    if (!target) {
        console.warn("gestures.js: عنصر presentationRoot مش موجود.");
        return;
    }

    const scene = document.getElementById("sceneContainer");
    if (!scene) {
        console.warn("gestures.js: عنصر sceneContainer مش موجود.");
    }

    let startX = 0;
    let isPointerDown = false;
    const swipeThreshold = 40;
    const rotateStep = 6;

    const getClientX = (event) =>
        event.clientX ??
        event.touches?.[0]?.clientX ??
        event.changedTouches?.[0]?.clientX ??
        0;

    const handlePointerDown = (event) => {
        isPointerDown = true;
        startX = getClientX(event);
        console.log("pointerdown", startX);
    };

    const handlePointerUp = (event) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        const endX = getClientX(event);
        const deltaX = endX - startX;
        console.log("pointerup", endX, "delta:", deltaX);

        if (Math.abs(deltaX) < swipeThreshold) {
            console.log("سحبة قصيرة، تجاهل.");
            return;
        }

        const direction = deltaX > 0 ? "right" : "left";
        spinScene(direction);
        notifyController(direction);
    };

    const spinScene = (direction) => {
        if (!scene) return;
        const currentRotation = Number(scene.dataset.rotation || 0);
        const nextRotation =
            direction === "right"
                ? currentRotation + rotateStep
                : currentRotation - rotateStep;

        scene.dataset.rotation = nextRotation;
        scene.style.transform = `rotateY(${nextRotation}deg)`;
        console.log("rotate", nextRotation);
    };

    const notifyController = (direction) => {
        const method = direction === "right" ? "goNext" : "goPrev";

        if (
            window.PresentationController &&
            typeof window.PresentationController[method] === "function"
        ) {
            window.PresentationController[method]();
            console.log("PresentationController:", method);
            return;
        }

        document.dispatchEvent(
            new CustomEvent("swipeNavigation", {
                detail: { direction }
            })
        );
        console.log("dispatch swipeNavigation", direction);
    };

    target.addEventListener("pointerdown", handlePointerDown);
    target.addEventListener("pointerup", handlePointerUp);
    target.addEventListener("pointerleave", () => (isPointerDown = false));

    target.addEventListener("touchstart", handlePointerDown, { passive: true });
    target.addEventListener("touchend", handlePointerUp);
});
