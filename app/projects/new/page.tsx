import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";
import NewProjectForm from "@/components/NewProjectForm";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <AppNav />

                <NewProjectForm />

                <div className="mt-8">
                    <FeedbackPanel />
                </div>
            </div>
        </main>
    );
}