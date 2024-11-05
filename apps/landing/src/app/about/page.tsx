
import React from 'react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">О компании Forwarding Company</h1>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Наши услуги</h2>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Грузоперевозки</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">По всему Казахстану и в страны СНГ</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Виды грузов</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">От небольших личных заказов до крупных оптовых поставок</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Клиенты</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Физические и юридические лица</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Наши преимущества</h2>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                            <li>Адекватное ценообразование и возможность получения скидок</li>
                            <li>Современный транспорт различных габаритов</li>
                            <li>Возможность страхования груза</li>
                            <li>Быстрая доставка благодаря оптимизированной логистике</li>
                            <li>Индивидуальный расчет стоимости</li>
                            <li>Возможность отслеживания груза</li>
                            <li>Доставка до двери получателя</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Контактная информация</h2>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Адрес</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Республика Казахстан, 050000, г. Алматы, ул. Панфилова, 14, офис 7</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">+7 (727) 390 50 00</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">zakaz@abttrans.kz</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}