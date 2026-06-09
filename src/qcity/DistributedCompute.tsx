"use client";
import React, { useEffect, useState } from "react";
interface ComputeNode {
  id: string;
  name: string;
  provider: "aws" | "azure" | "gcp" | "local" | "qcity";
  type: "gpu" | "cpu";
  specs: {
    gpuCount?: number;
    gpuModel?: string;
    cpuCores: number;
    memoryGB: number;
  };
  location: string;
  costPerHour: number;
  status: "available" | "busy" | "offline";
}
const sampleNodes: ComputeNode[] = [
  { id: "1", name: "AWS-P3-Instance-1", provider: "aws", type: "gpu", specs: { gpuCount: 8, gpuModel: "V100", cpuCores: 32, memoryGB: 244 }, location: "us-east-1", costPerHour: 12.24, status: "available" },
  { id: "2", name: "Azure-NC6s-v3", provider: "azure", type: "gpu", specs: { gpuCount: 1, gpuModel: "V100", cpuCores: 6, memoryGB: 112 }, location: "eastus", costPerHour: 3.06, status: "busy" },
  { id: "3", name: "QCity-Compute-Node-1", provider: "qcity", type: "gpu", specs: { gpuCount: 4, gpuModel: "A100", cpuCores: 16, memoryGB: 128 }, location: "qcity-cloud", costPerHour: 0, status: "available" },
];
export default function DistributedCompute() {
  const [nodes, setNodes] = useState<ComputeNode[]>([]);
  useEffect(() => {
    setNodes(sampleNodes);
  }, []);
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Distributed Compute</h2>
        <p className="text-sm text-slate-500">Monitor and allocate compute resources across providers.</p>
      </div>
      <div className="grid gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{node.name}</div>
                <div className="text-sm text-slate-500">{node.provider.toUpperCase()} · {node.location}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{node.status}</span>
            </div>
            <div className="mt-3 text-sm text-slate-600">GPU: {node.specs.gpuCount || 0} · CPU: {node.specs.cpuCores} · RAM: {node.specs.memoryGB} GB</div>
            <div className="mt-2 text-sm font-medium text-slate-900">${node.costPerHour.toFixed(2)}/hr</div>
          </div>
        ))}
      </div>
    </div>
  );
}
