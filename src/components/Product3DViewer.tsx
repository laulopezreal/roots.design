import { Canvas } from "@react-three/fiber";
import { OrbitControls, Splat, Center, Loader } from "@react-three/drei";
import { Suspense, useState } from "react";

interface Product3DViewerProps {
    modelUrl: string;
    className?: string;
}

function ErrorFallback({ error }: { error: Error }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 p-4 text-center">
            <div>
                <p className="font-bold">Optimization Required</p>
                <p className="text-sm mt-1">Raw .ply files are too heavy for the web.</p>
                <p className="text-xs mt-2 text-gray-600">Please convert your file to .splat format.</p>
            </div>
        </div>
    );
}

export default function Product3DViewer({ modelUrl, className = "" }: Product3DViewerProps) {
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        return <ErrorFallback error={error} />;
    }

    return (
        <div className={`relative w-full h-full min-h-[400px] bg-gray-50 rounded-lg overflow-hidden ${className}`}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} onError={(e) => setError(e as unknown as Error)}>
                <color attach="background" args={["#f9fafb"]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Suspense fallback={null}>
                    <Center>
                        <Splat src={modelUrl} />
                    </Center>
                </Suspense>

                <OrbitControls
                    makeDefault
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75}
                />
            </Canvas>
            <Loader />

            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 border border-white/50 shadow-sm pointer-events-none">
                Interactive 3D
            </div>
        </div>
    );
}
