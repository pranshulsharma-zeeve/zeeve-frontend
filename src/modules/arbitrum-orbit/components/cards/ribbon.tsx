export default function Ribbon() {
  return (
    <div className="absolute right-[-3px] top-[-3px] h-[88px] w-[85px] overflow-hidden">
      <div className="relative left-[-5px] top-[15px] w-[120px] rotate-45 bg-brand-primary px-0 py-[4px] text-center font-medium text-white shadow-lg">
        <div className="absolute bottom-[-3px] left-0 border-x-[3px] border-t-[3px] border-x-transparent border-t-black"></div>
        Demo
        <div className="absolute bottom-[-3px] right-0 border-x-[3px] border-t-[3px] border-x-transparent border-t-black"></div>
      </div>
    </div>
  );
}
