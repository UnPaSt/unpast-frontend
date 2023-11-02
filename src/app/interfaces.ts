
export type BinarizationAlgorithm = 'GMM' | 'Jenks' | 'kmeans';
export type ClusteringAlgorithm = 'Louvain' | 'WGCNA' | 'DESMOND';
export type BiclusterDirecton = 'UP' | 'DOWN';


export interface TaskParameters {
    /**
     * Interface for task input parameters
     */
    id: string,
    name: string,
    seed: number,
    alpha: number,
    pValue: number,
    binarization: BinarizationAlgorithm,
    clustering: ClusteringAlgorithm,
    r: number,
    ds: 0 | 1 | 2 | 3 | 4,
    dch: number,
    mail: string,
    exprs: string,
    directions: string[],
    ceiling: number
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
    SNR: number,
    n_genes: number,
    genes: string[],
    gene_indices: number[],
    n_samples: number,
    samples: string[],
    sample_indices: number[],
    genes_up: string[],
    genes_down: string[],
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
