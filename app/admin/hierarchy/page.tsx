"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Loader2, ChevronDown, ChevronRight, User } from "lucide-react";

export default function HierarchyPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    adminAPI.getHierarchy().then(res => {
      setUsers(res.data.users);
    }).finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const buildTree = () => {
    const map: any = {};
    const roots: any[] = [];
    users.forEach((u: any) => {
      map[u._id] = { ...u, children: [] };
    });
    users.forEach((u: any) => {
      if (u.reportsTo && map[u.reportsTo]) {
        map[u.reportsTo].children.push(map[u._id]);
      } else {
        roots.push(map[u._id]);
      }
    });
    return roots;
  };

  const tree = buildTree();

  const renderNode = (node: any) => {
    const isOpen = expanded[node._id];
    return (
      <div key={node._id} className="ml-6">
        <div className="flex items-center gap-2 py-1 cursor-pointer" onClick={() => toggle(node._id)}>
          {node.children.length > 0 ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span className="w-4" />}
          <User size={16} />
          <span className="font-medium">{node.fullName}</span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{node.role}</span>
        </div>
        {isOpen && node.children.map((child: any) => renderNode(child))}
      </div>
    );
  };

  if (loading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Organisation Hierarchy</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        {tree.map(root => renderNode(root))}
      </div>
    </div>
  );
}