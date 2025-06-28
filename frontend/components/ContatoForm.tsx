import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Contato } from '@/types';

interface ContatoFormProps {
  onSave: () => void;
  contatoAtual?: Contato | null;
  setContatoAtual: (contato: Contato | null) => void;
}

export default function ContatoForm({ onSave, contatoAtual, setContatoAtual }: ContatoFormProps) {
  const [form, setForm] = useState<Omit<Contato, 'id' | 'createdAt'>>({
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
    foto: '',
  });

  const [foto, setFoto] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (contatoAtual) {
      setForm({
        nome: contatoAtual.nome,
        telefone: contatoAtual.telefone,
        email: contatoAtual.email,
        cep: contatoAtual.cep || '',
        estado: contatoAtual.estado || '',
        cidade: contatoAtual.cidade || '',
        bairro: contatoAtual.bairro || '',
        rua: contatoAtual.rua || '',
        numero: contatoAtual.numero || '',
        complemento: contatoAtual.complemento || '',
        foto: contatoAtual.foto || '',
      });

      setFoto(contatoAtual.foto ?? null);
      setPreview(contatoAtual.foto ? `http://localhost:4000/uploads/${contatoAtual.foto}` : null);
    } else {
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
        foto: '',
      });
      setFoto(null);
      setPreview(null);
    }
  }, [contatoAtual]);

  const buscarCep = async (cep: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          rua: data.logradouro,
        }));
      }
    } catch {
      console.error('Erro ao buscar CEP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        contatoAtual?.id
          ? `http://localhost:4000/contatos/${contatoAtual.id}`
          : 'http://localhost:4000/contatos',
        {
          method: contatoAtual?.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, foto }),
        }
      );

      if (!res.ok) throw new Error('Erro ao salvar contato');

      onSave();
      toast.success('Contato salvo com sucesso!');
      setContatoAtual(null);

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
        foto: '',
      });
      setFoto(null);
      setPreview(null);
    } catch {
      toast.error('Erro ao salvar o contato');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const res = await fetch('http://localhost:4000/contatos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const nomeImagem = data.url.split('/').pop();

      setFoto(nomeImagem);
      setPreview(data.url);
    } catch {
      toast.error('Erro ao fazer upload da imagem');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg 
           grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-none mb-8"
    >
      <h2 className="text-xl font-bold col-span-full mb-2">
        {contatoAtual ? 'Editar Contato' : 'Novo Contato'}
      </h2>

      <div className="col-span-full flex items-center gap-4">
        <input
          type="file"
          ref={inputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Adicionar Foto
        </button>

        {preview && (
          <div className="flex items-center gap-2">
            {/* ⚠️ Para avisos do ESLint, substitua <img> por <Image /> do next/image */}
            <img
              src={preview}
              alt="Preview"
              className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
            />
            <button
              type="button"
              className="text-sm px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                setFoto(null);
                setPreview(null);
              }}
            >
              Remover
            </button>
          </div>
        )}
      </div>

      <input type="text" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required className="p-2 border rounded w-full" />
      <input type="text" placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required className="p-2 border rounded w-full" />
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="col-span-full p-2 border rounded w-full" />

      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="CEP" value={form.cep} onChange={(e) => {
          const cep = e.target.value;
          setForm({ ...form, cep });
          if (cep.length === 8) buscarCep(cep);
        }} className="p-2 border rounded w-full" />
        <input type="text" placeholder="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="p-2 border rounded w-full" />
        <input type="text" placeholder="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="p-2 border rounded w-full" />
      </div>

      <input type="text" placeholder="Rua" value={form.rua} onChange={(e) => setForm({ ...form, rua: e.target.value })} className="col-span-full p-2 border rounded w-full" />

      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Número" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="p-2 border rounded w-full" />
        <input type="text" placeholder="Bairro" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} className="p-2 border rounded w-full" />
        <input type="text" placeholder="Complemento" value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} className="p-2 border rounded w-full" />
      </div>

      <div className="col-span-full flex justify-end gap-4 mt-4">
        {contatoAtual && (
          <button type="button" onClick={() => setContatoAtual(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <ToastContainer aria-label="Notificações" />
    </form>
  );
}