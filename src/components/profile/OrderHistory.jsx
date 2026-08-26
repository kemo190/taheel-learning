"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const ChevronIcon = ({ expanded }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;

export default function OrderHistory({ locale, user, dict }) {
  const isRtl = locale === 'ar';
  const [expandedId, setExpandedId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
        if (data.length > 0) {
          setExpandedId(data[0].id);
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col text-start px-2">
        <h2 className="text-3xl font-bold text-[#0b2646] mb-2">
          {dict?.profile?.tabs?.history || 'Order History'}
        </h2>
        <p className="text-gray-500 font-medium">
          {dict?.profile?.history?.desc || 'Track all your financial transactions and purchased courses.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#0b2646]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <p className="text-gray-500 font-medium">{dict?.profile?.history?.noOrders || 'You have no previous orders.'}</p>
            <Link href={`/${locale}/courses`} className="mt-4 text-[#0b2646] font-bold hover:underline">
              {dict?.profile?.history?.browseCourses || 'Browse available courses'}
            </Link>
          </div>
        ) : orders.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              
              {/* Accordion Header */}
              <div 
                onClick={() => toggleExpand(order.id)}
                className="flex flex-col lg:flex-row items-center w-full cursor-pointer hover:bg-gray-50 transition-colors p-5 gap-4 lg:gap-0"
              >
                {/* Grid Columns */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-4 lg:gap-0 text-center text-sm">
                  
                  {/* Col 1 */}
                  <div className="flex flex-col gap-2 items-center justify-center rtl:lg:border-l ltr:lg:border-r border-gray-200">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.orderId || 'Order ID'}</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs sm:text-sm">
                      <ReceiptIcon /> <span className="max-w-[80px] sm:max-w-[100px] truncate" title={order.id}>{order.id.split('-')[0]}</span>
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col gap-2 items-center justify-center rtl:lg:border-l ltr:lg:border-r border-gray-200">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.date || 'Date'}</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs sm:text-sm">
                      <CalendarIcon /> <span className="dir-ltr inline-block truncate max-w-[100px] sm:max-w-none">{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="flex flex-col gap-2 items-center justify-center rtl:lg:border-l ltr:lg:border-r border-gray-200">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.paymentMethod || 'Payment Method'}</span>
                    <div className="flex items-center justify-center text-gray-500 h-[20px]">
                      <CardIcon />
                    </div>
                  </div>

                  {/* Col 4 */}
                  <div className="flex flex-col gap-2 items-center justify-center rtl:lg:border-l ltr:lg:border-r border-gray-200">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.totalPaid || 'Total Paid'}</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs sm:text-sm">
                      <MoneyIcon /> {order.price} {order.currency}
                    </div>
                  </div>

                  {/* Col 5 */}
                  <div className="flex flex-col gap-2 items-center justify-center rtl:lg:border-l ltr:lg:border-r border-gray-200">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.totalCourses || 'Total Courses'}</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs sm:text-sm">
                      <BookIcon /> 1 {dict?.profile?.history?.course || 'Course'}
                    </div>
                  </div>

                  {/* Col 6 */}
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <span className="text-[#0b2646] font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">{dict?.profile?.history?.status || 'Status'}</span>
                    <div className="flex items-center justify-center">
                      <span className="px-3 sm:px-4 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                        {order.status === 'success' ? (dict?.profile?.history?.statusSuccess || 'Successful') : order.status}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Chevron */}
                <div className="lg:w-16 flex items-center justify-center text-gray-400 mt-2 lg:mt-0">
                  <ChevronIcon expanded={isExpanded} />
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  <div className="w-full bg-[#f4f7fb] rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                    
                    {/* Course Info */}
                    <div className="flex flex-col items-center sm:items-start gap-2 flex-1 pt-1 rtl:text-right ltr:text-left">
                      <h4 className="font-bold text-gray-900 text-lg">{order.course_title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#0b2646] font-bold">
                        <span className="text-gray-600 font-medium">
                          {dict?.profile?.history?.by || 'By:'} <span className="underline decoration-1 underline-offset-4 text-[#0b2646]">{order.course_provider}</span>
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
                          {dict?.profile?.history?.type || 'Type:'} {order.course_type}
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <MoneyIcon />
                          {dict?.profile?.history?.price || 'Price:'} {order.price} {order.currency}
                        </div>
                      </div>
                    </div>

                    {/* Course Image */}
                    <div className="relative w-full sm:w-[140px] h-[90px] rounded-lg overflow-hidden border border-white/50 shadow-sm shrink-0">
                      <Image 
                        src={order.course_image} 
                        alt={order.course_title} 
                        fill 
                        className="object-cover"
                      />
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
