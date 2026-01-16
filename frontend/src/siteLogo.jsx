import { FilmIcon } from "@heroicons/react/24/outline";

export function Logo({className=""}){
    return(
        <div className={`flex items-start gap-1 group transition ${className}`}>
            <FilmIcon className=" w-[1.8em] h-[2.3em] text-purple-500 mt-1 group-hover:text-purple-600 
      transition-colors duration-200 "/>

            <h1 className="font-semibold tracking-wide leading-none">
                <LogoLine text="ovie"/>
                <div className="ml-2">
                    <LogoLine text="aniacs"/>
                </div>
            </h1>
        </div>
    );
}

function LogoLine({ text }) {
  return (
    <div className="flex">
      <span className="font-bold text-purple-500 text-[1.3em] group-hover:text-purple-600 
      transition-colors duration-200">M</span>
      <span className="font-normal  text-white text-[0.75em] mt-2 group-hover:text-purple-100 
      transition-colors duration-200">{text}</span>
    </div>
  );
}