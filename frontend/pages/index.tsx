import { useEffect, useState } from 'react';
import ContatoForm from '@/components/ContatoForm';
import ListaContatos from '@/components/ListaContatos';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  createdAt?: string;
}

export default function Home() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [contatoParaEditar, setContatoParaEditar] = useState<Contato | null>(null);

  async function carregarContatos() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/contatos');
      if (!res.ok) throw new Error('Erro ao buscar contatos');
      const data = await res.json();
      setContatos(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletandoId(id);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch(`http://localhost:4000/contatos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || 'Erro ao excluir contato');
      }

      setContatos(prev => prev.filter(contato => contato.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Erro ao excluir contato');
      }
    } finally {
      setDeletandoId(null);
    }
  }

  function handleEditar(contato: Contato) {
    setContatoParaEditar(contato);
  }

  useEffect(() => {
    carregarContatos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda de Contatos</h1>

      <ContatoForm
        onContatoCriado={carregarContatos}
        contatoParaEditar={contatoParaEditar}
        onCancelarEdicao={() => setContatoParaEditar(null)}
      />

      <h2 className="text-xl font-semibold mt-8 mb-4">Lista de Contatos</h2>

      {loading && <p>Carregando contatos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ListaContatos
          contatos={contatos}
          onDelete={handleDelete}
          deletandoId={deletandoId}
          onEditar={handleEditar} 
        />
      )}
    </main>
  );
}