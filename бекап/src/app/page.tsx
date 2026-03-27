"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const phone = getCurrentUserPhone();
    if (phone) {
      if (phone === "79999999999") {
        router.replace("/admin");
      } else {
        router.replace("/client-partner");
      }
    } else {
      router.replace("/registration");
    }
  }, [router]);
  
  return null;
}
