import { useState, useEffect } from 'react';

interface Contato {
  id?: number;
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
  foto?: string;
}

interface ContatoFormProps {
  onContatoCriado: () => void;
  contatoParaEditar?: Contato | null;
  onCancelarEdicao?: () => void;
}

export default function ContatoForm({
  onContatoCriado,
  contatoParaEditar,
  onCancelarEdicao,
}: ContatoFormProps) {
  const [form, setForm] = useState<Contato>({
    nome: '',
    telefone: '',
    email: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
  });
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contatoParaEditar) {
      setForm({ ...contatoParaEditar });
      setPreviewFoto(contatoParaEditar.foto || null);
    } else {
      limparCampos();
    }
  }, [contatoParaEditar]);

  function limparCampos() {
    setForm({
      nome: '',
      telefone: '',
      email: '',
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
    });
    setFotoPerfil(null);
    setPreviewFoto(null);
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPerfil(file);
      setPreviewFoto(URL.createObjectURL(file));
    } else {
      setFotoPerfil(null);
      setPreviewFoto(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      let fotoUrl = form.foto || '';
      if (fotoPerfil) {
        const formFoto = new FormData();
        formFoto.append('foto', fotoPerfil);
        const uploadRes = await fetch('http://localhost:4000/contatos/upload', {
          method: 'POST',
          body: formFoto,
        });
        const uploadData = await uploadRes.json();
        fotoUrl = uploadData.url;
      }

      const corpo = { ...form, foto: fotoUrl };

      const res = await fetch(
        contatoParaEditar
          ? `http://localhost:4000/contatos/${contatoParaEditar.id}`
          : 'http://localhost:4000/contatos',
        {
          method: contatoParaEditar ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erros?.join(', ') || 'Erro ao salvar contato');
      }

      setMensagemSucesso(
        contatoParaEditar ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!'
      );
      limparCampos();
      onContatoCriado();
      if (contatoParaEditar && onCancelarEdicao) onCancelarEdicao();
      setTimeout(() => setMensagemSucesso(null), 3000);
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow space-y-6"
    >
      {mensagemSucesso && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center">
          {mensagemSucesso}
        </div>
      )}
      {erro && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded text-center">
          {erro}
        </div>
      )}

      <div className="mb-6 text-center">
        {previewFoto && (
          <img
            src={previewFoto}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover mx-auto mb-2 border-2 border-blue-500"
          />
        )}

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Foto de Perfil
        </label>
        <input type="file" accept="image/*" onChange={handleFotoChange} className="block mx-auto" />
      </div>

      <fieldset className="border border-gray-300 dark:border-zinc-700 p-4 rounded-md">
        <legend className="text-lg font-semibold px-2 mb-4 block">Dados Pessoais</legend>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          required
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
      </fieldset>

      <fieldset className="border border-gray-300 dark:border-zinc-700 p-4 rounded-md">
        <legend className="text-lg font-semibold px-2 mb-4 block">Endereço</legend>
        <input
          type="text"
          placeholder="CEP"
          value={form.cep}
          onChange={(e) => setForm({ ...form, cep: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Estado"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Bairro"
          value={form.bairro}
          onChange={(e) => setForm({ ...form, bairro: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Rua"
          value={form.rua}
          onChange={(e) => setForm({ ...form, rua: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Número"
          value={form.numero}
          onChange={(e) => setForm({ ...form, numero: e.target.value })}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Complemento"
          value={form.complemento}
          onChange={(e) => setForm({ ...form, complemento: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </fieldset>

      <div className="flex justify-end space-x-3 pt-4">
        {contatoParaEditar && (
          <button
            type="button"
            onClick={() => onCancelarEdicao && onCancelarEdicao()}
            className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
        >
          {loading ? 'Salvando...' : 'Salvar Contato'}
        </button>
      </div>
    </form>
  );
}
