import { ClipboardList } from "lucide-react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import { ProfilePanel } from "./ProfilePanel";

interface ProfileNotesPanelProps {
    notes: string;
    onSave: (notes: string) => void | Promise<void>;
}

export function ProfileNotesPanel({
    notes,
    onSave,
}: ProfileNotesPanelProps) {
    return (
        <ProfilePanel
            title="Officer notes"
            icon={<ClipboardList />}
            delay={0.1}
            className="flex h-full flex-col"
        >
            <RichTextEditor
                content={notes}
                onSave={onSave}
                height={440}
                placeholder="Add operational notes about this citizen..."
            />
            <p className="mt-3 text-xs text-neutral-600">
                Notes are visible to authorized personnel.
            </p>
        </ProfilePanel>
    );
}
