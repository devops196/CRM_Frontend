import AppShell from '../../AppShell.jsx';

export default function LookupDetailPage({ params }) {
  const identifier = decodeURIComponent(params.identifier || '');
  return <AppShell initialView="user_credit_details" initialUserIdentifier={identifier} />;
}
