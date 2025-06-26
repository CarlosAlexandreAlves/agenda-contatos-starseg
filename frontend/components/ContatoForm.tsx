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
  const [error, setError] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (contatoParaEditar) {
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
    } else {
      limparCampos();
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

    const contatoData = {
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
    };

    try {
      
       await new Promise((resolve) => setTimeout(resolve, 1000));
       
      let res;
      if (contatoParaEditar && contatoParaEditar.id) 
        
        {
        res = await fetch(`http://localhost:4000/contatos/${contatoParaEditar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contatoData),
        });
      } else 
    
      {
        res = await fetch('http://localhost:4000/contatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contatoData),
        });
      }

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
    <>
      {mensagemSucesso && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {mensagemSucesso}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow space-y-5"
      >
        {error && (
          <p className="text-red-600 bg-red-100 dark:bg-red-900 px-4 py-2 rounded">
            {error}
          </p>
        )}

        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="text-lg font-semibold px-2">Dados Pessoais</legend>

          <div>
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border p-2 rounded"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-semibold">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded mt-4">
          <legend className="text-lg font-semibold px-2">Endereço</legend>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold">CEP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{8}"
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
                    } else {
                      setEstado('');
                      setCidade('');
                      setBairro('');
                      setRua('');
                    }
                  }
                }}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>

            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold">Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>

            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold">Estado</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-semibold">Rua</label>
              <input
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>

            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-semibold">Bairro</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold">Número</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>

            <div className="w-full md:w-2/3">
              <label className="block mb-1 font-semibold">Complemento (opcional)</label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full border p-2 rounded"
                disabled={loading}
              />
            </div>
          </div>
        </fieldset>

        <div className="pt-2 flex items-center">
          {contatoParaEditar && (
            <button
              type="button"
              onClick={() => {
                if (onCancelarEdicao) onCancelarEdicao();
              }}
              className="mr-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !rua || !bairro || !cidade || !estado}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Contato'}
          </button>
        </div>
      </form>
    </>
  );
}