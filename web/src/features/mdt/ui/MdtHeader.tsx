import LspdLogo from "../../../assets/lspd.png";
import Avatar from "../../../assets/default-avatar-profile.png";
import { usePersonalDataStore } from "../../../stores";

interface HeaderProps {
    setOpen: (open: boolean) => void;
}

export const MdtHeader = (props: HeaderProps) => {
    const personalData = usePersonalDataStore((state) => state.personalData);

    return (
        <div className="mdt-header flex justify-between items-center w-full py-2 px-4 gap-3">
            <div className="flex items-center gap-2">
                <img src={LspdLogo} alt="LSPD" className="w-12" />

                <div className="flex flex-col">
                    <span className="text-white font-medium">Los Santos Police Department</span>
                    <span className="text-[#6f6f6f] font-medium">Mobile Database Terminal</span>
                </div>
            </div>

            <button
                aria-label="Search MDT"
                className="mdt-command flex flex-row items-center justify-between rounded-lg cursor-pointer bg-[#313131] border border-[#575757] py-1.5 px-3 gap-2 w-[28rem] max-w-[30%]"
                onClick={() => {
                    props.setOpen(true);
                }}
            >
                <div className="flex items-center gap-3">
                    <svg
                        className="shrink-0 size-4 text-gray-400 dark:text-white/60"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <p className="text-gray-400 font-small">Search</p>
                </div>

                <kbd className="px-2 py-0.5 text-xs font-semibold text-white bg-brand-dark border border-brand-gray rounded-md shadow-outer">
                    Ctrl + K
                </kbd>
            </button>

            <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col items-end gap-0">
                    <div className="flex gap-2">
                        <span className="text-white font-medium text-sm">
                            {personalData.firstname} {personalData.lastname}
                        </span>

                        <div className="h-[20px] w-0.5 self-stretch bg-neutral-600"></div>

                        <span className="text-white font-medium text-sm bg-gray-500 rounded-md px-1">
                            {personalData.callSign}
                        </span>
                    </div>
                    <span className="text-[#6f6f6f] font-medium text-sm">{personalData.role}</span>
                </div>

                <img
                    src={personalData.image || Avatar}
                    alt="Officer portrait"
                    className="w-12 h-12 rounded-full"
                    onError={(event) => {
                        event.currentTarget.src = Avatar;
                    }}
                />
            </div>
        </div>
    );
};
