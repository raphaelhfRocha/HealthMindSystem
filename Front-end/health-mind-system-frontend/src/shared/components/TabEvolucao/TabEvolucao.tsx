import { HistoricoMedicoDTO } from "../../types/dtos/HistoricoMedico.dto";
import { MetaTerapeuticaDTO } from "../../types/dtos/MetaTerapeutica.dto";
import { SessaoDTO } from "../../types/dtos/Sessao.dto";
import SecaoEscalas from "../SecaoEscalas/SecaoEscalas";
import SecaoMetas from "../SecaoMetas/SecaoMetas";

export default function TabEvolucao({ historico, temProntuario, sessoes, onSalvarMeta, onReload }: {
  historico: HistoricoMedicoDTO | null;
  temProntuario: boolean;
  sessoes: SessaoDTO[];
  onSalvarMeta: (meta: MetaTerapeuticaDTO) => Promise<void>;
  onReload: () => Promise<void>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SecaoMetas
        historico={historico}
        temProntuario={temProntuario}
        onSalvarMeta={onSalvarMeta}
      />
      <SecaoEscalas
        sessoes={sessoes}
        onReload={onReload}
      />
    </div>
  );
}