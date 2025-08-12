'use client';

import { useEffect, useState } from "react";


export default function CurrentTime() {   // todo: improvement
  const [nowDate, setNowDate] = useState(() => new Date());
  // console.log("rendering")

  useEffect(() => {
    const id = setInterval(() => setNowDate(new Date()), 1000*60);
    return () => clearInterval(id);
  }, []);

  const time = nowDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return <>{time}</>;
}
