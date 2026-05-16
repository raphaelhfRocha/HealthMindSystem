import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { getAllPsicologos } from 'shared/services/psicologo.service';
import { PsicologoDTO } from 'shared/types/dtos/Psicologo.dto';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [psicologos, setPsicologos] = useState<PsicologoDTO[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const psicologosResponse = await getAllPsicologos();
        console.log("Dados psicologos: ", psicologosResponse);
        setPsicologos(psicologosResponse);
      } catch (error) {
        console.error('Erro ao carregar dados dos psicologos:', error);
        setErro('Nao foi possivel carregar os dados. Verifique se a API esta em execucao.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: 203,
                    label: 'Total Income',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
