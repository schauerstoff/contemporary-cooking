import { useEffect, useState } from "react";

export default function HealthIndicator() {
    const [status, setStatus] = useState<"ok" | "error" | "loading">("loading");

    useEffect(() => {
        fetch("http://localhost:3000/api/health")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => setStatus("ok"))
            .catch(() => setStatus("error"));
    }, []);

    const color =
        status === "ok" ? "green" : status === "error" ? "red" : "gray";

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                }}
            />
            <span>Backend</span>
        </div>
    );
}