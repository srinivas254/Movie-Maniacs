import { useEffect, useState, useRef } from "react"

export function MovieReel({posters}) {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const trackRef = useRef(null)

    useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1)
    }, 2000)
    return () => clearInterval(id)
  }, [])

    useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const onEnd = () => {
      if (index === posters.length) {
        setAnimate(false)
        setIndex(0)
      }
    }

    el.addEventListener("transitionend", onEnd)
    return () => el.removeEventListener("transitionend", onEnd)
  }, [index, posters.length])

   useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() => setAnimate(true))
    }
  }, [animate])

  useEffect(() => {
  const handleVisibility = () => {
    if (!document.hidden) {
      setAnimate(false)
      setIndex(0)

      requestAnimationFrame(() => setAnimate(true))
    }
  }

  document.addEventListener("visibilitychange", handleVisibility)

  return () =>
    document.removeEventListener("visibilitychange", handleVisibility)
}, [])


  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className={`flex ${animate ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {[...posters, posters[0]].map((p, i) => (
          <div key={i} className="min-w-full aspect-[2/3] overflow-hidden">
            <img src={p} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
