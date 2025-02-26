"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Check, Plus, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Module {
  id: string
  name: string
}

interface Props {
  videoId: string
  playlistId: string | null
  userId: string
  modules: Module[]
}

export default function VideoOptionsForm({ videoId, playlistId, userId, modules }: Props) {
  const [action, setAction] = useState<"single" | "playlist" | "new">("single")
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [newModuleName, setNewModuleName] = useState("")
  const [newModuleType, setNewModuleType] = useState<"single" | "playlist">("single")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const effectiveAction = moduleId ? "existing" : action
    const payload: any = {
      userId,
      videoId,
      moduleId,
      action: effectiveAction,
    }

    if (action === "playlist" && playlistId) {
      payload.playlistId = playlistId
    }

    if (action === "new") {
      payload.newModuleName = newModuleName || `New Module ${new Date().toLocaleTimeString()}`
      payload.newModuleType = newModuleType
    }

    const res = await fetch("/api/add-to-module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (res.ok) {
      router.push(`/video-modules/${data.module.id}`)
    } else {
      alert(`Error: ${data.error}`)
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Video Module</DialogTitle>
          <DialogDescription>Add this video to an existing module or create a new one.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <Label>Choose an option</Label>
              <RadioGroup
                defaultValue="single"
                value={action}
                onValueChange={(value) => setAction(value as "single" | "playlist" | "new")}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Add only this video
                  </Label>
                </div>
                {playlistId && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="playlist" id="playlist" />
                    <Label htmlFor="playlist" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Add entire playlist
                    </Label>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create new module
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {(action === "single" || action === "playlist") && (
              <div className="space-y-2">
                <Label htmlFor="module">Select Existing Module</Label>
                <Select value={moduleId || ""} onValueChange={(value) => setModuleId(value || null)}>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {modules.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {action === "new" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Module Name</Label>
                  <Input
                    id="name"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Enter module name"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Create for</Label>
                  <RadioGroup
                    defaultValue="single"
                    value={newModuleType}
                    onValueChange={(value) => setNewModuleType(value as "single" | "playlist")}
                    className="grid gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="new-single" />
                      <Label htmlFor="new-single">Single Video</Label>
                    </div>
                    {playlistId && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="playlist" id="new-playlist" />
                        <Label htmlFor="new-playlist">Full Playlist</Label>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!moduleId && action !== "new"}>
              <Check className="mr-2 h-4 w-4" />
              Add to Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface Module {
//   id: string;
//   name: string;
// }

// interface Props {
//   videoId: string;
//   playlistId: string | null;
//   userId: string;
//   modules: Module[];
// }

// export default function VideoOptionsForm({ videoId, playlistId, userId, modules }: Props) {
//   const [action, setAction] = useState<'single' | 'playlist' | 'new'>('single');
//   const [moduleId, setModuleId] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const effectiveAction = moduleId ? 'existing' : action;
//     const res = await fetch('/api/add-to-module', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         videoId,
//         playlistId: action === 'playlist' ? playlistId : null,
//         moduleId,
//         action: effectiveAction,
//       }),
//     });
//     const data = await res.json();
//     console.log(data);
//     if (res.ok) {
//       router.push(`/video-modules/${data.module.id}`);
//     } else {
//       alert(`Error: ${data.error}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Add to Video Module</h3>
//       <div>
//         <label>
//           <input
//             type="radio"
//             value="single"
//             checked={action === 'single'}
//             onChange={() => setAction('single')}
//           />
//           Add only this video
//         </label>
//         {playlistId && (
//           <label>
//             <input
//               type="radio"
//               value="playlist"
//               checked={action === 'playlist'}
//               onChange={() => setAction('playlist')}
//             />
//             Add entire playlist
//           </label>
//         )}
//         <label>
//           <input
//             type="radio"
//             value="new"
//             checked={action === 'new'}
//             onChange={() => setAction('new')}
//           />
//           Create new module
//         </label>
//       </div>
//       {(action === 'single' || action === 'playlist') && (
//         <div>
//           <label>
//             Select Existing Module:
//             <select
//               value={moduleId || ''}
//               onChange={(e) => setModuleId(e.target.value || null)}
//             >
//               <option value="">-- Select a module --</option>
//               {modules.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.name}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>
//       )}
//       <button type="submit" disabled={!moduleId && action !== 'new'}>
//         Add to Module
//       </button>
//     </form>
//   );
// }