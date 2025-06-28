import ContatoCard from './ContatoCard';
import { Contato } from '@/types';

interface ListaContatosProps {
  contatos: Contato[];
  onDelete: (id: number) => void;
  deletandoId: number | null;
  onEditar: (contato: Contato) => void;
}

export default function ListaContatos({
  contatos,
  onDelete,
  deletandoId,
  onEditar,
}: ListaContatosProps) {
  if (contatos.length === 0) {
    return (
      <p className="text-center text-zinc-500 dark:text-zinc-400">
        Nenhum contato encontrado.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {contatos.map((contato) => (
        <ContatoCard
          key={contato.id}
          contato={contato}
          onDelete={onDelete}
          deletandoId={deletandoId === contato.id}
          onEditar={onEditar}
        />
      ))}
    </ul>
  );
}