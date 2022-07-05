
export type BinarizationAlgorithm = 'GMM' | 'Jenks';
export type ClusteringAlgorithm = 'Louvain' | 'WGCNA' | 'DESMOND';
export type BiclusterDirecton = 'UP' | 'DOWN';


export interface TaskParameters {
    /**
     * Interface for task input parameters
     */
    id: string,
    seed: number,
    alpha: number,
    pValue: number,
    binarization: BinarizationAlgorithm,
    clustering: ClusteringAlgorithm,
    r: number,
    mail: string,
    exprs: string
}

export interface TaskResult {
    /**
   * Interface for task result
   */
    [key: number]: Bicluster
}

export interface Bicluster {
    /**
   * Interface for biclusters in task result
   */
    avgSNR: number,
    n_genes: number,
    genes: string[],
    gene_indices: number[],
    n_samples: number,
    samples: string[],
    sample_indices: number[],
    direction: BiclusterDirecton
}

export interface Task {
    /**
   * Interface for task attributes
   */
    id: string,
    status: string,
    query: TaskParameters,
    created: number,
    result?: TaskResult
}

export interface TaskInputDataRaw {
    columns: string[],
    rows: string[],
    values: any
}
