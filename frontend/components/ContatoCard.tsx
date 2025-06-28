import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Contato } from '@/types';

interface ContatoCardProps {
  contato: Contato & { id: number }; // <-- Garantimos que o id é obrigatório aqui
  onDelete: (id: number) => void;
  onEditar: (contato: Contato) => void;
  deletandoId: boolean;
}

export default function ContatoCard({
  contato,
  onDelete,
  onEditar,
  deletandoId,
}: ContatoCardProps) {
  const endereco = `${contato.rua || ''}, ${contato.numero || ''} - ${contato.bairro || ''}, ${contato.cidade || ''} - ${contato.estado || ''}`;

  return (
    <li className="bg-zinc-900 text-white rounded-2xl p-4 shadow-md flex gap-4 items-center w-full">
      {contato.foto && (
        <img
          src={`http://localhost:4000/uploads/${contato.foto}`}
          alt="Foto do contato"
          className="w-16 h-16 rounded-full border-2 border-white object-cover shrink-0"
          style={{ border: '2px solid white' }}
        />
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-bold truncate">{contato.nome}</h3>

        <p className="flex items-center gap-2 text-pink-400 text-sm truncate">
          <FaPhone /> {contato.telefone}
        </p>
        <p className="flex items-center gap-2 text-zinc-300 text-sm truncate">
          <FaEnvelope /> {contato.email}
        </p>
        <p className="flex items-center gap-2 text-zinc-300 text-sm truncate">
          <FaMapMarkerAlt /> {endereco}
        </p>
      </div>

      <div className="flex flex-col gap-2 ml-2">
        <button
          onClick={() => onEditar(contato)}
          className="bg-yellow-400 text-black text-sm px-2 py-1 rounded hover:brightness-90"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(contato.id)}
          className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:brightness-90"
          disabled={deletandoId}
        >
          {deletandoId ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </li>
  );
}