"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageCircle,
  Send,
  Users,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "react-toastify";

// 模拟消息类型
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export default function LiveClassRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [liveClass, setLiveClass] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 模拟参与者列表
  const [participants, setParticipants] = useState<any[]>([
    { id: "1", name: "Dr. Sharma (Host)", isHost: true },
    { id: "2", name: "You", isSelf: true },
  ]);

  useEffect(() => {
    const fetchLiveClass = async () => {
      try {
        const res = await educationAPI.getLiveClassDetails(id as string);
        setLiveClass(res.data.liveClass);
      } catch (error) {
        toast.error("Failed to load live class");
        router.push("/education/live");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClass();
  }, [id]);

  const joinClass = async () => {
    // 模拟加入成功
    setIsJoined(true);
    toast.success("Joined live class");
    // 这里应该初始化 Agora 客户端并加入频道
    // 模拟接收消息
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          userId: "host",
          userName: "Dr. Sharma",
          text: "Welcome everyone! We'll start in a few minutes.",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user?._id || "self",
      userName: user?.fullName || "You",
      text: newMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!liveClass) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Live class not found</p>
      </div>
    );
  }

  const isLive = liveClass.status === "live";
  const isScheduled = liveClass.status === "scheduled";
  const isEnded = liveClass.status === "ended";

  // 未加入状态显示等待室
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-[#1a237e] rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{liveClass.title}</h1>
          <p className="text-gray-500 mt-2">{liveClass.description}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Instructor: {liveClass.instructor?.fullName}</p>
            <p>Start Time: {new Date(liveClass.startTime).toLocaleString()}</p>
          </div>
          {isLive && (
            <button
              onClick={joinClass}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Join Live Class
            </button>
          )}
          {isScheduled && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-yellow-800">
              <p>This class hasn't started yet.</p>
              <p className="text-sm mt-1">Please come back at the scheduled time.</p>
            </div>
          )}
          {isEnded && (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl text-gray-600">
              <p>This class has ended.</p>
              {liveClass.recordingUrl && (
                <a
                  href={liveClass.recordingUrl}
                  target="_blank"
                  className="text-[#1a237e] hover:underline mt-2 inline-block"
                >
                  Watch Recording
                </a>
              )}
            </div>
          )}
          <button
            onClick={() => router.push("/education/live")}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            ← Back to Live Classes
          </button>
        </div>
      </div>
    );
  }

  // 已加入状态 - 直播房间界面
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 顶部工具栏 */}
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">{liveClass.title}</h2>
          <span className="text-xs bg-red-600 px-2 py-1 rounded-full animate-pulse">LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-lg ${isAudioEnabled ? "bg-gray-700" : "bg-red-600"}`}
          >
            {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-2 rounded-lg ${isVideoEnabled ? "bg-gray-700" : "bg-red-600"}`}
          >
            {isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          </button>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-gray-700">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={() => {
              setIsJoined(false);
              router.push("/education/live");
            }}
            className="p-2 rounded-lg hover:bg-red-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 主内容区：视频 + 侧边栏 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 视频区域 */}
        <div
          ref={videoContainerRef}
          className={`flex-1 bg-black relative ${showChat || showParticipants ? "w-3/4" : "w-full"}`}
        >
          {/* 主屏幕：远程视频 */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <img
                src="/placeholder-video.jpg"
                alt="Instructor"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Dr. Sharma (Host)
              </div>
            </div>
          </div>
          {/* 本地视频小窗 */}
          <div className="absolute bottom-4 right-4 w-40 h-28 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* 右侧聊天/参与者面板 */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* 标签切换 */}
            <div className="flex border-b">
              <button
                onClick={() => {
                  setShowChat(true);
                  setShowParticipants(false);
                }}
                className={`flex-1 py-3 font-medium ${showChat ? "text-[#1a237e] border-b-2 border-[#1a237e]" : "text-gray-500"}`}
              >
                Chat
              </button>
              <button
                onClick={() => {
                  setShowChat(false);
                  setShowParticipants(true);
                }}
                className={`flex-1 py-3 font-medium ${showParticipants ? "text-[#1a237e] border-b-2 border-[#1a237e]" : "text-gray-500"}`}
              >
                Participants ({participants.length})
              </button>
              <button
                onClick={() => {
                  setShowChat(false);
                  setShowParticipants(false);
                }}
                className="px-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {showChat && (
              <>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.userId === user?._id ? "justify-end" : ""}`}>
                      <div className={`max-w-[80%] ${msg.userId === user?._id ? "bg-[#1a237e] text-white" : "bg-gray-100"} rounded-lg px-3 py-2`}>
                        {msg.userId !== user?._id && <p className="text-xs font-medium text-gray-500">{msg.userName}</p>}
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-right text-[10px] opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    />
                    <button onClick={sendMessage} className="p-2 bg-[#1a237e] text-white rounded-full">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-sm">
                      {p.name} {p.isHost && "(Host)"} {p.isSelf && "(You)"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}