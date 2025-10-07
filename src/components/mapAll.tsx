"use client";

import MapWithPins, { type MapPin } from "@/components/MapWithPins";

export default function MapPage() {
    // 必ず pins を定義して渡す
    const pins: MapPin[] = [
        { id: "large_lab", x: 0, y: 0, href: "/facilities/large-lab", label: "大型実験棟" },
        { id: "energy_system", x: 47, y: 19, href: "/facilities/energy-system", label: "量子力学・システム安全棟" },
        { id: "mech_lab", x: 42, y: 35, href: "/facilities/mechanical-lab", label: "機械棟試験棟" },
        { id: "gym", x: 36, y: 55, href: "/facilities/gym", label: "体育館" },
        { id: "dojo", x: 44, y: 58, href: "/facilities/dojyo", label: "武道館" },
        { id: "applied_lab", x: 49, y: 66, href: "/facilities/applied-lab", label: "アプライドラボ" },
        { id: "lecture", x: 68, y: 38, href: "/facilities/lecture", label: "講義棟" },
        { id: "material_lab", x: 60, y: 32, href: "/facilities/material", label: "物質材料棟" },
        { id: "optics_center", x: 9, y: 73, href: "/facilities/optics", label: "地殻環境光実験センター" },
        { id: "bus_stop", x: 94, y: 85, href: "/access/bus", label: "バス停" },
    ];

    return (
        <main className="min-h-dvh w-full flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold text-black mb-4">キャンパスマップ</h1>

            <MapWithPins
                imageSrc="/map_all.svg"
                aspectRatio={350 / 251}
                pins={pins}
                className="max-w-6xl"
            />

            <p className="mt-4 text-sm text-neutral-600">
                ホイール／ピンチで拡大、ドラッグで移動、ダブルクリックで拡大できます。
            </p>
        </main>
    );
}
