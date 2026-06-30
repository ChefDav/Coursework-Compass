const feedbackEmail = "zzichuan0808@outlook.com";

export default function FeedbackLink() {
    const subject = encodeURIComponent("Coursework Compass feedback");
    const body = encodeURIComponent(
        [
            "Hi, I tested Coursework Compass and here is my feedback:",
            "",
            "1. What worked well:",
            "",
            "2. What confused me:",
            "",
            "3. What feature I want next:",
            "",
            "4. My device/browser:",
            "",
        ].join("\n"),
    );

    return (
        <a
            href={`mailto:${feedbackEmail}?subject=${subject}&body=${body}`}
            className="cc-button-secondary rounded-full px-4 py-2 text-sm"
        >
            Feedback
        </a>
    );
}
