import { useEffect, useState } from 'react';
import ContatoForm from '@/components/ContatoForm';
import ListaContatos from '@/components/ListaContatos';
import ConfirmarModal from '@/components/ConfirmarModal';
import { Contato } from '@/types';

export default function Home() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [contatoEditando, setContatoEditando] = useState<Contato | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const carregarContatos = async () => {
    try {
      const res = await fetch('http://localhost:4000/contatos');
      const data = await res.json();
      setContatos(data);
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
    }
  };

  const solicitarExclusao = (id: number) => {
    setIdParaExcluir(id);
    setMostrarModal(true);
  };

  const confirmarExclusao = async () => {
    if (!idParaExcluir) return;
    setDeletandoId(idParaExcluir);
    setMostrarModal(false);

    try {
      await fetch(`http://localhost:4000/contatos/${idParaExcluir}`, {
        method: 'DELETE',
      });
      carregarContatos();
    } catch (err) {
      console.error('Erro ao deletar contato:', err);
    } finally {
      setDeletandoId(null);
      setIdParaExcluir(null);
    }
  };

  useEffect(() => {
    carregarContatos();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Agenda de Contatos</h1>

      <div className="flex flex-col lg:flex-row lg:gap-6 items-start justify-center w-full">
        <div className="w-full max-w-md">
          <ContatoForm
            onSave={carregarContatos}
            contatoAtual={contatoEditando ?? undefined}
            setContatoAtual={(c) => setContatoEditando(c ?? null)}
          />
        </div>

        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Lista de Contatos</h2>
          <ListaContatos
            contatos={contatos}
            onDelete={solicitarExclusao}
            deletandoId={deletandoId}
            onEditar={setContatoEditando}
          />
        </div>
      </div>

      <ConfirmarModal
        visivel={mostrarModal}
        mensagem="Deseja realmente excluir este contato?"
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmarExclusao}
      />
    </main>
  );
}