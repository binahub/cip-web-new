export interface AgeCategoryItem {
  id: string;
  name: string;
  from: string;
  until: string;
  description: string;
  icon: string;
}

export interface NationalityItem {
  id: string;
  name: string;
  description: string;
}

export interface GenderItem {
  code: string;
  persianName: string;
}

export interface GenderListData {
  list: GenderItem[];
}

export interface LookupListParams {
  parameterMap: Record<string, string>;
}
