interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  createdAt?: string;
}

interface ContatoCardProps {
  contato: Contato;
  onDelete: (id: number) => void;
  deletando: boolean;
  onEditar: (contato: Contato) => void;  // Nova prop para editar
}

export default function ContatoCard({ contato, onDelete, deletando, onEditar }: ContatoCardProps) {
  return (
    <li className="bg-white dark:bg-zinc-800 p-4 rounded shadow flex justify-between items-center">
      <div>
        <p className="font-semibold">{contato.nome}</p>
        <p>{contato.telefone}</p>
        <p>{contato.email}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEditar(contato)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
          type="button"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(contato.id)}
          disabled={deletando}
          className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded ${deletando ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
        >
          {deletando ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </li>
  );
}
