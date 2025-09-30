function Modalrun(): void {
    const modal = document.getElementById("eventModal") as HTMLDivElement | null;
    const iframe = document.getElementById("eventFrame") as HTMLIFrameElement | null;
    const eventBtn = document.getElementById("eventBtn") as HTMLButtonElement;
    const closeBtn = document.getElementById("xbtn") as HTMLButtonElement | null;
    console.error('null');
    // check if types are not null?
    if (!modal || !iframe || !eventBtn || !closeBtn) {
        return;
    }

    if (eventBtn) {
        eventBtn.addEventListener("click", function (event: Event) {
            event.preventDefault();

            const href = eventBtn.getAttribute("href");
            if (href) {
                iframe.src = href;
            }
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', function (event: Event) {
            event.preventDefault();
            modal.style.display = "none";
        }
        );
    }
}
// load page
document.addEventListener('DOMContentLoaded', Modalrun);