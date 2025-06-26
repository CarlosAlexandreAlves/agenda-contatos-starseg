import ContatoCard from './ContatoCard';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  foto?: string;
  createdAt?: string;
}

interface ListaContatosProps {
  contatos: Contato[];
  onDelete: (id: number) => void;
  deletandoId: number | null;
  onEditar: (contato: Contato) => void;
}

export default function ListaContatos({ contatos, onDelete, deletandoId, onEditar }: ListaContatosProps) {
  if (contatos.length === 0) {
    return <p>Nenhum contato encontrado.</p>;
  }

  return (
    <ul className="space-y-4 w-full">
      {contatos.map(contato => (
        <ContatoCard
          key={contato.id}
          contato={contato}
          onDelete={onDelete}
          deletando={deletandoId === contato.id}
          onEditar={onEditar}
        />
      ))}
    </ul>
  );
}
