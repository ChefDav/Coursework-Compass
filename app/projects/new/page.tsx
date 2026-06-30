import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";
import NewProjectForm from "@/components/NewProjectForm";

export default function NewProjectPage() {
    return (
        <main className="cc-page-gradient cc-ambient-drift cc-text-main">
            <div className="cc-page-shell">
                <AppNav />

                <NewProjectForm />

                <div className="mt-8">
                    <FeedbackPanel />
                </div>
            </div>
        </main>
    );
}
