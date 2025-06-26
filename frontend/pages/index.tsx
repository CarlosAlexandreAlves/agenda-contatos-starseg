import { useEffect, useState } from 'react';
import ContatoForm from '@/components/ContatoForm';
import ListaContatos from '@/components/ListaContatos';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  foto?: string;
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
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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
      let errorMsg = 'Erro ao excluir contato';
      try {
        const data = await res.json();
        if (data?.erro) errorMsg = data.erro;
      } catch (_) {
        // erro ao parsear json, mantém mensagem padrão
      }
      throw new Error(errorMsg);
    }

    // Remover contato da lista local
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

      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-3/5 lg:w-2/3">
          <ContatoForm
            onContatoCriado={carregarContatos}
            contatoParaEditar={contatoParaEditar}
            onCancelarEdicao={() => setContatoParaEditar(null)}
          />
        </div>

        <div className="w-full md:w-2/5 lg:w-1/3 mt-8 md:mt-0">
          <h2 className="text-xl font-semibold mb-4">Lista de Contatos</h2>

          {loading && <p>Carregando Contatos...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <ListaContatos
              contatos={contatos}
              onDelete={handleDelete}
              deletandoId={deletandoId}
              onEditar={handleEditar}
            />
          )}
        </div>
      </div>
    </main>
  );
}
