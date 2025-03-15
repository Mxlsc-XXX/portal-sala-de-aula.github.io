import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  BookOpenIcon,
  TableCellsIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Trabalhos', href: '/trabalhos', icon: ClipboardDocumentListIcon },
  { name: 'Datas', href: '/datas', icon: CalendarIcon },
  { name: 'Apps', href: '/apps', icon: DevicePhoneMobileIcon },
  { name: 'Guias', href: '/guias', icon: BookOpenIcon },
  { name: 'Planilhas', href: '/planilhas', icon: TableCellsIcon },
  { name: 'Avisos', href: '/avisos', icon: MegaphoneIcon },
];

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Portal da Sala</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-500"
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 