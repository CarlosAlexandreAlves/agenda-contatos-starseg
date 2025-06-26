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
  onEditar: (contato: Contato) => void;  // Nova prop para editar
}

export default function ListaContatos({ contatos, onDelete, deletandoId, onEditar }: ListaContatosProps) {
  if (contatos.length === 0) {
    return <p>Nenhum contato encontrado.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-4">
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
