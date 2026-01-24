
export function UserNameField({value, onChange, issues, onBlur}){
    return(
         <div className="space-y-2">

            <div className="relative">
                <input
                          type="text"
                          placeholder="Username"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          onBlur={onBlur}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2
                          focus:outline-none focus:ring-2 focus:ring-gray-400"
                          required
                        />
            </div>
          
            { issues.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{issue}</span>
                </li>
            ))}
            </ul>
            )}
         </div>
        
    )
}