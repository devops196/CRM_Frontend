import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Search,
  ShieldAlert,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type Customer = {
  id: number;
  name: string;
  company: string;
  creditLimit: number;
  outstanding: number;
  overdue: number;
  daysOverdue: number;
  utilization: number;
  riskScore: number;
  risk: RiskLevel;
  owner: string;
  promiseDate?: string;
};

const customers: Customer[] = [
  {
    id: 1, name: "Rahul Sharma", company: "ABC Pvt Ltd",
    creditLimit: 1000000, outstanding: 780000, overdue: 240000,
    daysOverdue: 18, utilization: 78, riskScore: 74,
    risk: "MEDIUM", owner: "Rahul", promiseDate: "25 Aug",
  },
  {
    id: 2, name: "Amit Verma", company: "XYZ Industries",
    creditLimit: 800000, outstanding: 760000, overdue: 480000,
    daysOverdue: 42, utilization: 95, riskScore: 38,
    risk: "CRITICAL", owner: "Amit",
  },
  {
    id: 3, name: "Priya Singh", company: "PQR Technologies",
    creditLimit: 1500000, outstanding: 650000, overdue: 75000,
    daysOverdue: 11, utilization: 43, riskScore: 86,
    risk: "LOW", owner: "Priya", promiseDate: "28 Aug",
  },
  {
    id: 4, name: "Karan Mehta", company: "Nova Solutions",
    creditLimit: 500000, outstanding: 470000, overdue: 190000,
    daysOverdue: 34, utilization: 94, riskScore: 45,
    risk: "HIGH", owner: "Karan",
  },
  {
    id: 5, name: "Neha Gupta", company: "Orbit Retail",
    creditLimit: 1200000, outstanding: 390000, overdue: 45000,
    daysOverdue: 7, utilization: 33, riskScore: 91,
    risk: "LOW", owner: "Neha",
  },
];

const collectionTrend = [
  { month: "Mar", outstanding: 82, collected: 61 },
  { month: "Apr", outstanding: 88, collected: 68 },
  { month: "May", outstanding: 79, collected: 65 },
  { month: "Jun", outstanding: 91, collected: 73 },
  { month: "Jul", outstanding: 84, collected: 76 },
  { month: "Aug", outstanding: 72, collected: 63 },
];

const agingData = [
  { name: "Current", value: 32.5 },
  { name: "1-30 Days", value: 12.8 },
  { name: "31-60 Days", value: 8.4 },
  { name: "61-90 Days", value: 4.2 },
  { name: "90+ Days", value: 3.1 },
];

const riskData = [
  { name: "Low", value: 62 },
  { name: "Medium", value: 27 },
  { name: "High", value: 8 },
  { name: "Critical", value: 3 },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const riskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "LOW": return "green";
    case "MEDIUM": return "yellow";
    case "HIGH": return "orange";
    case "CRITICAL": return "red";
  }
};

export default function CreditControl() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState<"overview" | "customers" | "collections" | "approvals">("overview");

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const matchesSearch =
      customer.company.toLowerCase().includes(search.toLowerCase()) ||
      customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "ALL" || customer.risk === riskFilter;
    return matchesSearch && matchesRisk;
  }), [search, riskFilter]);

  const totalExposure = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0);
  const totalOverdue = customers.reduce((sum, c) => sum + c.overdue, 0);
  const collectionRate = Math.round(((totalOutstanding - totalOverdue) / totalOutstanding) * 100);

  return (
    <Box minH="100vh" bg="gray.950" color="white" p={{ base: 4, md: 6, lg: 8 }}>
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} gap={4} mb={7}>
        <HStack gap={3}>
          <Box p={3} borderRadius="xl" bg="blue.500/15" color="blue.300"><CreditCard size={26} /></Box>
          <Box>
            <Heading size="lg">Credit Control</Heading>
            <Text color="gray.400" fontSize="sm">Team credit risk & collection management</Text>
          </Box>
        </HStack>
        <HStack>
          <Button variant="outline" borderColor="gray.700" color="gray.200"><Filter size={16} /> Filter</Button>
          <Button colorPalette="blue"><Download size={16} /> Export Report</Button>
        </HStack>
      </Flex>

      <HStack borderBottom="1px solid" borderColor="gray.800" mb={6} gap={1} overflowX="auto">
        {[
          ["overview", "Overview"],
          ["customers", "Customers"],
          ["collections", "Collections"],
          ["approvals", "Approvals"],
        ].map(([value, label]) => (
          <Button key={value} variant="ghost" borderRadius="none" borderBottom="2px solid"
            borderColor={activeTab === value ? "blue.400" : "transparent"}
            color={activeTab === value ? "blue.300" : "gray.400"}
            onClick={() => setActiveTab(value as typeof activeTab)}>
            {label}
          </Button>
        ))}
      </HStack>

      {activeTab !== "overview" && (
        <Flex gap={3} mb={5} wrap="wrap">
          <Box position="relative" maxW="400px" flex="1">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.500"><Search size={17} /></Box>
            <Input pl={10} placeholder="Search customer or company..." value={search}
              onChange={(e) => setSearch(e.target.value)} bg="gray.900" borderColor="gray.700" />
          </Box>
          {(["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((risk) => (
            <Button key={risk} size="sm" variant={riskFilter === risk ? "solid" : "outline"}
              colorPalette={risk === "ALL" ? "blue" : riskColor(risk)}
              onClick={() => setRiskFilter(risk)}>{risk}</Button>
          ))}
        </Flex>
      )}

      {activeTab === "overview" && (
        <Stack gap={6}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <MetricCard title="Credit Exposure" value={money(totalExposure)} change="+8.4%" positive icon={<DollarSign size={21} />} />
            <MetricCard title="Outstanding" value={money(totalOutstanding)} change="-4.2%" positive icon={<CreditCard size={21} />} />
            <MetricCard title="Overdue Amount" value={money(totalOverdue)} change="+12.8%" positive={false} icon={<AlertTriangle size={21} />} />
            <MetricCard title="Collection Rate" value={`${collectionRate}%`} change="+5.7%" positive icon={<TrendingUp size={21} />} />
          </SimpleGrid>

          <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={5}>
            <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
              <Card.Header><Heading size="sm">Collection Performance</Heading><Text color="gray.500" fontSize="sm">Outstanding vs collected amount</Text></Card.Header>
              <Card.Body h="320px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={collectionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" stroke="#71717a" /><YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }} />
                    <Area type="monotone" dataKey="outstanding" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.12} />
                    <Area type="monotone" dataKey="collected" stroke="#34d399" fill="#34d399" fillOpacity={0.12} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
              <Card.Header><Heading size="sm">Risk Distribution</Heading></Card.Header>
              <Card.Body>
                <Box h="230px">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90} paddingAngle={4}>
                        {riskData.map((item) => (
                          <Cell key={item.name} fill={
                            item.name === "Low" ? "#22c55e" :
                            item.name === "Medium" ? "#eab308" :
                            item.name === "High" ? "#f97316" : "#ef4444"
                          } />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <VStack align="stretch" gap={2}>
                  {riskData.map((item) => <Flex key={item.name} justify="space-between" fontSize="sm"><Text color="gray.400">{item.name}</Text><Text fontWeight="bold">{item.value}%</Text></Flex>)}
                </VStack>
              </Card.Body>
            </Card.Root>
          </Grid>

          <Grid templateColumns={{ base: "1fr", xl: "1fr 1.5fr" }} gap={5}>
            <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
              <Card.Header><Heading size="sm">Receivables Aging</Heading></Card.Header>
              <Card.Body>
                <Box h="280px">
                  <ResponsiveContainer>
                    <BarChart data={agingData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis type="number" stroke="#71717a" />
                      <YAxis dataKey="name" type="category" width={80} stroke="#71717a" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#60a5fa" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card.Body>
            </Card.Root>
            <PriorityCustomers customers={customers} />
          </Grid>

          <TeamPerformance />
        </Stack>
      )}

      {activeTab === "customers" && <CustomerTable customers={filteredCustomers} />}
      {activeTab === "collections" && <Collections customers={filteredCustomers} />}
      {activeTab === "approvals" && <ApprovalQueue />}
    </Box>
  );
}

function MetricCard({ title, value, change, positive, icon }: {
  title: string; value: string; change: string; positive: boolean; icon: React.ReactNode;
}) {
  return (
    <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
      <Card.Body>
        <Flex justify="space-between" align="flex-start">
          <Box>
            <Text color="gray.500" fontSize="sm">{title}</Text>
            <Heading size="md" mt={2}>{value}</Heading>
            <HStack mt={3} fontSize="xs">
              {positive ? <ArrowUpRight size={14} color="#22c55e" /> : <ArrowDownRight size={14} color="#ef4444" />}
              <Text color={positive ? "green.400" : "red.400"}>{change}</Text>
              <Text color="gray.600">vs last month</Text>
            </HStack>
          </Box>
          <Box p={3} bg="blue.500/10" borderRadius="lg" color="blue.400">{icon}</Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

function PriorityCustomers({ customers }: { customers: Customer[] }) {
  const priority = customers.filter(c => c.risk === "HIGH" || c.risk === "CRITICAL").sort((a, b) => b.overdue - a.overdue);

  return (
    <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
      <Card.Header>
        <Flex justify="space-between">
          <Box><Heading size="sm">Priority Collections</Heading><Text color="gray.500" fontSize="sm">Customers requiring immediate action</Text></Box>
          <Badge colorPalette="red">{priority.length} Critical</Badge>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>
          {priority.map(customer => (
            <Box key={customer.id} p={4} borderRadius="lg" bg="gray.950" border="1px solid" borderColor="gray.800">
              <Flex justify="space-between" align="flex-start" gap={4}>
                <Box>
                  <Text fontWeight="bold">{customer.company}</Text>
                  <Text color="gray.500" fontSize="sm">{customer.name}</Text>
                  <HStack mt={2} gap={3}>
                    <Text color="red.400" fontSize="sm" fontWeight="bold">{money(customer.overdue)}</Text>
                    <Text color="gray.500" fontSize="xs">{customer.daysOverdue} days overdue</Text>
                  </HStack>
                </Box>
                <Badge colorPalette={riskColor(customer.risk)}>{customer.risk}</Badge>
              </Flex>
              <Progress mt={3} value={customer.utilization} colorPalette={customer.utilization >= 90 ? "red" : "yellow"} size="sm" />
              <Flex justify="space-between" mt={2} fontSize="xs"><Text color="gray.500">Credit utilization</Text><Text>{customer.utilization}%</Text></Flex>
            </Box>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

function TeamPerformance() {
  const team = [
    { name: "Rahul", outstanding: 1820000, collected: 1480000, recovery: 81 },
    { name: "Amit", outstanding: 1240000, collected: 1090000, recovery: 88 },
    { name: "Priya", outstanding: 2110000, collected: 1870000, recovery: 89 },
    { name: "Karan", outstanding: 980000, collected: 720000, recovery: 73 },
  ];

  return (
    <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
      <Card.Header><HStack><Users size={18} /><Heading size="sm">Team Performance</Heading></HStack></Card.Header>
      <Card.Body>
        <Table.Root variant="outline" size="sm">
          <Table.Header><Table.Row bg="gray.950">
            <Table.ColumnHeader color="gray.500">Controller</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">Outstanding</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">Collected</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">Recovery</Table.ColumnHeader>
          </Table.Row></Table.Header>
          <Table.Body>
            {team.map(person => <Table.Row key={person.name}>
              <Table.Cell>{person.name}</Table.Cell>
              <Table.Cell>{money(person.outstanding)}</Table.Cell>
              <Table.Cell color="green.400">{money(person.collected)}</Table.Cell>
              <Table.Cell><Badge colorPalette={person.recovery >= 85 ? "green" : "yellow"}>{person.recovery}%</Badge></Table.Cell>
            </Table.Row>)}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
}

function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
      <Card.Header><Heading size="md">Customer Credit Profiles</Heading><Text color="gray.500">Credit exposure, utilization and risk</Text></Card.Header>
      <Card.Body overflowX="auto">
        <Table.Root variant="outline">
          <Table.Header><Table.Row bg="gray.950">
            <Table.ColumnHeader>Customer</Table.ColumnHeader><Table.ColumnHeader>Credit Limit</Table.ColumnHeader>
            <Table.ColumnHeader>Outstanding</Table.ColumnHeader><Table.ColumnHeader>Overdue</Table.ColumnHeader>
            <Table.ColumnHeader>Utilization</Table.ColumnHeader><Table.ColumnHeader>Risk Score</Table.ColumnHeader><Table.ColumnHeader>Risk</Table.ColumnHeader>
          </Table.Row></Table.Header>
          <Table.Body>
            {customers.map(customer => <Table.Row key={customer.id}>
              <Table.Cell><Text fontWeight="bold">{customer.company}</Text><Text fontSize="xs" color="gray.500">{customer.name}</Text></Table.Cell>
              <Table.Cell>{money(customer.creditLimit)}</Table.Cell>
              <Table.Cell>{money(customer.outstanding)}</Table.Cell>
              <Table.Cell color="red.400">{money(customer.overdue)}</Table.Cell>
              <Table.Cell minW="150px">
                <Progress value={customer.utilization} colorPalette={customer.utilization >= 90 ? "red" : customer.utilization >= 75 ? "yellow" : "green"} size="sm" />
                <Text fontSize="xs" mt={1}>{customer.utilization}%</Text>
              </Table.Cell>
              <Table.Cell><Text fontWeight="bold" color={customer.riskScore >= 80 ? "green.400" : customer.riskScore >= 60 ? "yellow.400" : "red.400"}>{customer.riskScore}/100</Text></Table.Cell>
              <Table.Cell><Badge colorPalette={riskColor(customer.risk)}>{customer.risk}</Badge></Table.Cell>
            </Table.Row>)}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
}

function Collections({ customers }: { customers: Customer[] }) {
  return (
    <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={5}>
      <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
        <Card.Header><Heading size="md">Collection Queue</Heading><Text color="gray.500">Prioritized customer follow-ups</Text></Card.Header>
        <Card.Body><Stack gap={3}>
          {customers.filter(c => c.overdue > 0).sort((a, b) => b.overdue - a.overdue).map(customer => (
            <Flex key={customer.id} justify="space-between" align="center" p={4} bg="gray.950" borderRadius="lg">
              <HStack>
                <Box p={2} borderRadius="full" bg="red.500/10" color="red.400"><Clock3 size={18} /></Box>
                <Box><Text fontWeight="bold">{customer.company}</Text><Text fontSize="xs" color="gray.500">{customer.daysOverdue} days overdue</Text></Box>
              </HStack>
              <HStack><Text fontWeight="bold" color="red.400">{money(customer.overdue)}</Text><Button size="sm" colorPalette="blue">Follow Up</Button></HStack>
            </Flex>
          ))}
        </Stack></Card.Body>
      </Card.Root>

      <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
        <Card.Header><Heading size="sm">Collection Summary</Heading></Card.Header>
        <Card.Body><Stack gap={5}>
          <SummaryItem label="Due Today" value="₹3.4L" color="yellow.400" />
          <SummaryItem label="Due This Week" value="₹8.2L" color="blue.400" />
          <SummaryItem label="Promise to Pay" value="₹4.6L" color="green.400" />
          <SummaryItem label="Escalated" value="₹6.1L" color="red.400" />
        </Stack></Card.Body>
      </Card.Root>
    </Grid>
  );
}

function SummaryItem({ label, value, color }: { label: string; value: string; color: string }) {
  return <Flex justify="space-between"><Text color="gray.500">{label}</Text><Text fontWeight="bold" color={color}>{value}</Text></Flex>;
}

function ApprovalQueue() {
  const approvals = [
    { id: "CR-1024", customer: "XYZ Industries", currentLimit: "₹8,00,000", requestedLimit: "₹10,00,000", risk: "HIGH", requestedBy: "Amit" },
    { id: "CR-1025", customer: "Nova Solutions", currentLimit: "₹5,00,000", requestedLimit: "₹6,50,000", risk: "MEDIUM", requestedBy: "Karan" },
  ];

  return (
    <Card.Root bg="gray.900" borderColor="gray.800" borderWidth="1px">
      <Card.Header><HStack><ShieldAlert size={20} /><Box><Heading size="md">Credit Approval Queue</Heading><Text color="gray.500">Requests requiring manager approval</Text></Box></HStack></Card.Header>
      <Card.Body><Stack gap={4}>
        {approvals.map(approval => (
          <Box key={approval.id} p={5} bg="gray.950" border="1px solid" borderColor="gray.800" borderRadius="xl">
            <Flex justify="space-between" align="flex-start" gap={5} direction={{ base: "column", md: "row" }}>
              <Box>
                <HStack>
                  <Text fontWeight="bold">{approval.customer}</Text>
                  <Badge colorPalette="blue">{approval.id}</Badge>
                  <Badge colorPalette={riskColor(approval.risk as RiskLevel)}>{approval.risk}</Badge>
                </HStack>
                <Text mt={2} fontSize="sm" color="gray.500">Requested by {approval.requestedBy}</Text>
                <HStack mt={4} gap={8}>
                  <Box><Text fontSize="xs" color="gray.500">Current Limit</Text><Text fontWeight="bold">{approval.currentLimit}</Text></Box>
                  <Box><Text fontSize="xs" color="gray.500">Requested Limit</Text><Text fontWeight="bold" color="blue.400">{approval.requestedLimit}</Text></Box>
                </HStack>
              </Box>
              <HStack>
                <Button colorPalette="red" variant="outline"><XCircle size={16} /> Reject</Button>
                <Button colorPalette="green"><CheckCircle2 size={16} /> Approve</Button>
              </HStack>
            </Flex>
          </Box>
        ))}
      </Stack></Card.Body>
    </Card.Root>
  );
}