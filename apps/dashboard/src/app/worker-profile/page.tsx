'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from '@repo/database';
import { Sidebar } from '@/components/SideBar';
import { UserCircle, Settings, Calculator, HelpCircle, Trello, ChartBarIncreasing, FileText, PlusCircle, Trash2, Printer } from 'lucide-react';
import WCalculator from '@/components/Calculator';

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

export default function WorkerProfilePage() {
    const { user, token, loading, logout } = useUserData();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    // Invoice state
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [newItem, setNewItem] = useState<InvoiceItem>({ description: '', quantity: 0, price: 0 });

    const sidebarItems = [
        { icon: UserCircle, label: 'Профиль', href: '#profile' },
        { icon: ChartBarIncreasing, label: 'Статистика', href: '#statistics' },
        { icon: Trello, label: 'Заказы', href: '#orders' },
        { icon: FileText, label: 'Счета', href: '#invoices' },
        { icon: Calculator, label: 'Калькулятор', href: '#calculator' },
        { icon: Settings, label: 'Настройки', href: '#settings' },
        { icon: HelpCircle, label: 'Помогите', href: '#help' },
    ];

    useEffect(() => {
        if (!loading && (!user || user.user_type !== 'worker')) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    const addItem = () => {
        if (newItem.description && newItem.quantity > 0 && newItem.price > 0) {
            setItems([...items, newItem]);
            setNewItem({ description: '', quantity: 0, price: 0 });
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !token || user.user_type !== 'worker') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">
            <Sidebar
                items={sidebarItems}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onItemClick={setActiveSection}
            />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {activeSection === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-[#1D1D1F]">Профиль работника</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">Имя</Label>
                                    <p className="mt-1 text-lg text-[#1D1D1F]">{user.fullName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">Email</Label>
                                    <p className="mt-1 text-lg text-[#1D1D1F]">{user.email}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={logout}
                                    className="bg-[#D1350F] text-white py-2 px-4 rounded-lg hover:bg-red-400 transition-colors"
                                >
                                    Выйти
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeSection === 'invoices' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-[#1D1D1F]">Создать счет</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="invoiceNumber">Номер счета</Label>
                                        <Input
                                            id="invoiceNumber"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            placeholder="INV-001"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="customerName">Имя клиента</Label>
                                        <Input
                                            id="customerName"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Имя клиента"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="customerEmail">Email клиента</Label>
                                    <Input
                                        id="customerEmail"
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="client@example.com"
                                    />
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Описание</TableHead>
                                            <TableHead>Количество</TableHead>
                                            <TableHead>Цена</TableHead>
                                            <TableHead>Итого</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                                <TableCell>{item.quantity * item.price}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="grid grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Описание"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Количество"
                                        value={newItem.quantity || ''}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Цена"
                                        value={newItem.price || ''}
                                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <Button onClick={addItem} className="w-full bg-[#00358E] hover:bg-blue-600">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Добавить позицию
                                </Button>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-xl font-semibold text-[#00358E]">Итого: {calculateTotal()} тенге</div>
                                <Button onClick={handlePrint} className='bg-[#00358E] hover:bg-blue-600'>
                                    <Printer className="mr-2 h-4 w-4" /> Распечатать счет
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeSection === 'calculator' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-[#1D1D1F]">Калькулятор стоимости</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <WCalculator/>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'settings' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-black">Настройки</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Здесь будут отображаться ваши настройки.</p>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'help' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-[#1D1D1F]">Поддержка</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Здесь будет отображаться информация о поддержке.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}