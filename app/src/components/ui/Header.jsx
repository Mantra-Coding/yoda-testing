import { Search, Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-green-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#178563]">Yoda</h1>
          <span className="ml-2 text-sm text-green-600">Piattaforma di Mentorship</span>
        </div>
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca mentori, argomenti o video"
              className="w-full px-4 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#178563]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="text-green-600 cursor-pointer" />
          <User className="text-green-600 cursor-pointer" />
        </div>
      </div>
    </header>
  )
}