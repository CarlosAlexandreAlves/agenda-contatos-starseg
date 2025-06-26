import { useState, useEffect, useRef } from 'react';

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

interface Endereco {
  uf?: string;
  localidade?: string;
  bairro?: string;
  logradouro?: string;
  erro?: boolean;
}

export default function ContatoForm({
  onContatoCriado,
  contatoParaEditar,
  onCancelarEdicao,
}: ContatoFormProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cepValido, setCepValido] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (contatoParaEditar) {
      setFoto(contatoParaEditar.foto || null);
      setPreview(contatoParaEditar.foto ? `http://localhost:4000/uploads/${contatoParaEditar.foto}` : null);
      setNome(contatoParaEditar.nome || '');
      setTelefone(contatoParaEditar.telefone || '');
      setEmail(contatoParaEditar.email || '');
      setCep(contatoParaEditar.cep || '');
      setEstado(contatoParaEditar.estado || '');
      setCidade(contatoParaEditar.cidade || '');
      setBairro(contatoParaEditar.bairro || '');
      setRua(contatoParaEditar.rua || '');
      setNumero(contatoParaEditar.numero || '');
      setComplemento(contatoParaEditar.complemento || '');
      setCepValido(!!contatoParaEditar.cep);
    } else {
      limparCampos();
      setFoto(null);
      setPreview(null);
    }
  }, [contatoParaEditar]);

  function limparCampos() {
    setNome('');
    setTelefone('');
    setEmail('');
    setCep('');
    setEstado('');
    setCidade('');
    setBairro('');
    setRua('');
    setNumero('');
    setComplemento('');
    setCepValido(false);
    setFoto(null);
    setPreview(null);
  }

  async function buscarEnderecoPorCEP(cep: string): Promise<Endereco | null> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Erro ao buscar CEP');
      const data: Endereco = await response.json();
      if (data.erro) throw new Error('CEP não encontrado');
      return data;
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensagemSucesso(null);

    const novoContato: Contato = {
      nome,
      telefone,
      email,
      cep,
      estado,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      foto: foto ?? undefined,
    };

    try {
      const res = await fetch(
        contatoParaEditar && contatoParaEditar.id
          ? `http://localhost:4000/contatos/${contatoParaEditar.id}`
          : 'http://localhost:4000/contatos',
        {
          method: contatoParaEditar && contatoParaEditar.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoContato),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erros ? data.erros.join(', ') : 'Erro ao salvar contato');
      }

      setMensagemSucesso(
        contatoParaEditar ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!'
      );

      limparCampos();
      onContatoCriado();

      if (contatoParaEditar && onCancelarEdicao) {
        onCancelarEdicao();
      }

      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2x1 mx-auto bg-white dark:bg-zinc-900 p-4 sm:p-6 min-h-[512px] rounded-xl shadow space-y-8"
    >
      {mensagemSucesso && (
        <div className="text-green-600 font-semibold text-center">
          {mensagemSucesso}
        </div>
      )}
      {error && (
        <div className="text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg">Informações Pessoais</legend>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append('foto', file);

                try {
                  const res = await fetch('http://localhost:4000/contatos/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!res.ok) throw new Error('Erro ao enviar imagem');

                  const data = await res.json();
                  if (!data.url || !data.url.includes('/')) {
                    throw new Error('URL inválida retornada pelo servidor');
                  }

                  const nomeArquivo = data.url.split('/').pop();
                  if (!nomeArquivo) throw new Error('Nome da imagem inválido');

                  setFoto(nomeArquivo);
                  setPreview(data.url);
                } catch (err) {
                  console.error('Erro ao enviar imagem:', err);
                }
              }
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Adicionar Foto
          </button>

          {preview && (
            <div className="flex items-center gap-2">
              <img
                src={preview}
                alt="Preview da foto"
                className="sm:w-16 sm:h-16 w-12 h-12 object-cover rounded-full border-2 border-blue-500"
              />

              <button
                type="button"
                onClick={async () => {
                  if (foto) {
                    try {
                      await fetch(`http://localhost:4000/contatos/upload/${foto}`, {
                        method: 'DELETE',
                      });
                    } catch (err) {
                      console.error('Erro ao deletar a imagem no servidor:', err);
                    }
                  }
                  setFoto(null);
                  setPreview(null);
                }}
                className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remover Foto
              </button>
            </div>
          )}
        </div>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
          className="w-full p-2 border rounded h-12"
        />
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Telefone"
          required
          className="w-full p-2 border rounded h-12"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded h-12"
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg">Endereço</legend>
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={cep}
          onChange={async (e) => {
            const valor = e.target.value.replace(/\D/g, '');
            setCep(valor);

            if (valor.length === 8) {
              const endereco = await buscarEnderecoPorCEP(valor);
              if (endereco) {
                setEstado(endereco.uf || '');
                setCidade(endereco.localidade || '');
                setBairro(endereco.bairro || '');
                setRua(endereco.logradouro || '');
                setCepValido(true);
              } else {
                setEstado('');
                setCidade('');
                setBairro('');
                setRua('');
                setCepValido(false);
              }
            } else {
              setCepValido(false);
            }
          }}
          placeholder="CEP"
          required
          className="w-full p-2 border rounded h-12"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Estado"
            required
            disabled={!cepValido}
            className="w-full sm:w-1/3 p-2 border rounded h-12"
          />
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            required
            disabled={!cepValido}
            className="w-full sm:w-2/3 p-2 border rounded h-12"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            placeholder="Rua"
            required
            className="w-full sm:w-2/3 p-2 border rounded h-12"
          />
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Número"
            required
            className="w-full sm:w-1/3 p-2 border rounded h-12"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
            required
            className="w-full sm:w-1/2 p-2 border rounded h-12"
          />
          <input
            type="text"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            placeholder="Complemento"
            className="w-full sm:w-1/2 p-2 border rounded h-12"
          />
        </div>
      </fieldset>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        {contatoParaEditar && (
          <button
            type="button"
            onClick={onCancelarEdicao}
            className="px-4 py-2 rounded bg-gray-400 text-white"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form >
  );
}