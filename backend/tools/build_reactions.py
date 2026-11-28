"""Reproducible teaching database. Equations are curated, coefficients verified separately.
No kinetic, equilibrium yield or arbitrary-mixture prediction is implied.
"""
import json
from pathlib import Path
ROWS=[]
def add(group, equations, condition, phenomenon, hazard):
    for eq in equations.strip().splitlines():
        def side(s):
            result={}
            for term in s.split(' + '):
                parts=term.strip().split(' ')
                result[parts[-1]]=int(parts[0]) if len(parts)==2 else 1
            return result
        left,right=eq.split(' -> ')
        ROWS.append(dict(id=f'R{len(ROWS)+1:03}',category=group,equation=eq,reactants=side(left),products=side(right),condition=condition,phenomenon=phenomenon,hazard=hazard,model='stoichiometric_upper_bound',source='https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions',review='atom balance automated; classroom validation still required'))
add('Axit–bazơ','''HCl + NaOH -> NaCl + H2O
HCl + KOH -> KCl + H2O
2 HCl + Ca(OH)2 -> CaCl2 + 2 H2O
2 HCl + Mg(OH)2 -> MgCl2 + 2 H2O
HNO3 + NaOH -> NaNO3 + H2O
HNO3 + KOH -> KNO3 + H2O
2 HNO3 + Ca(OH)2 -> Ca(NO3)2 + 2 H2O
2 HNO3 + Mg(OH)2 -> Mg(NO3)2 + 2 H2O
H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O
H2SO4 + 2 KOH -> K2SO4 + 2 H2O
H2SO4 + Mg(OH)2 -> MgSO4 + 2 H2O
CH3COOH + NaOH -> CH3COONa + H2O
CH3COOH + KOH -> CH3COOK + H2O
2 CH3COOH + Ca(OH)2 -> Ca(CH3COO)2 + 2 H2O
2 CH3COOH + Mg(OH)2 -> Mg(CH3COO)2 + 2 H2O
H3PO4 + 3 NaOH -> Na3PO4 + 3 H2O
H3PO4 + 3 KOH -> K3PO4 + 3 H2O
HCl + NH3 -> NH4Cl
HNO3 + NH3 -> NH4NO3
H2SO4 + 2 NH3 -> (NH4)2SO4''','aqueous_dilute_full_neutralization','Trung hòa; có thể tỏa nhiệt. Không tự đổi màu nếu thiếu chỉ thị.','corrosive')
add('Kết tủa','''AgNO3 + NaCl -> AgCl + NaNO3
AgNO3 + KCl -> AgCl + KNO3
AgNO3 + NaBr -> AgBr + NaNO3
AgNO3 + KBr -> AgBr + KNO3
AgNO3 + NaI -> AgI + NaNO3
AgNO3 + KI -> AgI + KNO3
BaCl2 + Na2SO4 -> BaSO4 + 2 NaCl
BaCl2 + K2SO4 -> BaSO4 + 2 KCl
Ba(NO3)2 + Na2SO4 -> BaSO4 + 2 NaNO3
CaCl2 + Na2CO3 -> CaCO3 + 2 NaCl
CaCl2 + K2CO3 -> CaCO3 + 2 KCl
Ca(NO3)2 + Na2CO3 -> CaCO3 + 2 NaNO3
CuSO4 + 2 NaOH -> Cu(OH)2 + Na2SO4
CuSO4 + 2 KOH -> Cu(OH)2 + K2SO4
CuCl2 + 2 NaOH -> Cu(OH)2 + 2 NaCl
FeCl3 + 3 NaOH -> Fe(OH)3 + 3 NaCl
FeCl3 + 3 KOH -> Fe(OH)3 + 3 KCl
FeSO4 + 2 NaOH -> Fe(OH)2 + Na2SO4
MgCl2 + 2 NaOH -> Mg(OH)2 + 2 NaCl
MgSO4 + 2 NaOH -> Mg(OH)2 + Na2SO4
MgSO4 + 2 KOH -> Mg(OH)2 + K2SO4
ZnSO4 + 2 NaOH -> Zn(OH)2 + Na2SO4
ZnCl2 + 2 KOH -> Zn(OH)2 + 2 KCl
AlCl3 + 3 NaOH -> Al(OH)3 + 3 NaCl
Al2(SO4)3 + 6 NaOH -> 2 Al(OH)3 + 3 Na2SO4''','aqueous_no_excess_complexing_reagent','Tạo kết tủa; màu được xác định theo sản phẩm.','irritant_or_toxic_salts')
add('Thế kim loại / oxi hóa–khử','''Zn + CuSO4 -> ZnSO4 + Cu
Fe + CuSO4 -> FeSO4 + Cu
Mg + CuSO4 -> MgSO4 + Cu
Zn + CuCl2 -> ZnCl2 + Cu
Fe + CuCl2 -> FeCl2 + Cu
Mg + CuCl2 -> MgCl2 + Cu
Cu + 2 AgNO3 -> Cu(NO3)2 + 2 Ag
Zn + 2 AgNO3 -> Zn(NO3)2 + 2 Ag
Fe + 2 AgNO3 -> Fe(NO3)2 + 2 Ag
Mg + 2 AgNO3 -> Mg(NO3)2 + 2 Ag
Zn + FeSO4 -> ZnSO4 + Fe
Mg + FeSO4 -> MgSO4 + Fe
Mg + ZnSO4 -> MgSO4 + Zn
Mg + ZnCl2 -> MgCl2 + Zn
Zn + FeCl2 -> ZnCl2 + Fe''','aqueous_clean_metal_no_excess_oxidant','Kim loại mới bám trên bề mặt; dung dịch có thể đổi màu.','metal_salt_waste')
add('Oxit bazơ','''CuO + 2 HCl -> CuCl2 + H2O
CuO + H2SO4 -> CuSO4 + H2O
CuO + 2 HNO3 -> Cu(NO3)2 + H2O
MgO + 2 HCl -> MgCl2 + H2O
MgO + H2SO4 -> MgSO4 + H2O
MgO + 2 HNO3 -> Mg(NO3)2 + H2O
CaO + 2 HCl -> CaCl2 + H2O
CaO + 2 HNO3 -> Ca(NO3)2 + H2O
ZnO + 2 HCl -> ZnCl2 + H2O
ZnO + H2SO4 -> ZnSO4 + H2O
ZnO + 2 HNO3 -> Zn(NO3)2 + H2O
Fe2O3 + 6 HCl -> 2 FeCl3 + 3 H2O
Fe2O3 + 3 H2SO4 -> Fe2(SO4)3 + 3 H2O
Fe2O3 + 6 HNO3 -> 2 Fe(NO3)3 + 3 H2O
CaO + H2O -> Ca(OH)2''','aqueous_suitable_contact','Oxit phản ứng, có thể hòa tan hoặc tỏa nhiệt; động học không được tính.','corrosive_heat')
add('Phân hủy','''CaCO3 -> CaO + CO2
MgCO3 -> MgO + CO2
CuCO3 -> CuO + CO2
ZnCO3 -> ZnO + CO2
2 NaHCO3 -> Na2CO3 + CO2 + H2O
2 KHCO3 -> K2CO3 + CO2 + H2O
Cu(OH)2 -> CuO + H2O
Mg(OH)2 -> MgO + H2O
2 Fe(OH)3 -> Fe2O3 + 3 H2O
2 Al(OH)3 -> Al2O3 + 3 H2O''','heating_required','Phân hủy khi được cấp nhiệt phù hợp; sinh khí/hơi hoặc đổi màu chất rắn.','heat_gas')
add('Axit–cacbonat','''Na2CO3 + 2 HCl -> 2 NaCl + CO2 + H2O
K2CO3 + 2 HCl -> 2 KCl + CO2 + H2O
CaCO3 + 2 HCl -> CaCl2 + CO2 + H2O
MgCO3 + 2 HCl -> MgCl2 + CO2 + H2O
NaHCO3 + HCl -> NaCl + CO2 + H2O
KHCO3 + HCl -> KCl + CO2 + H2O
Na2CO3 + 2 HNO3 -> 2 NaNO3 + CO2 + H2O
CaCO3 + 2 HNO3 -> Ca(NO3)2 + CO2 + H2O
NaHCO3 + CH3COOH -> CH3COONa + CO2 + H2O
Na2CO3 + 2 CH3COOH -> 2 CH3COONa + CO2 + H2O''','aqueous_open_vessel','Sủi bọt CO₂; mô hình không tính khí hòa tan hoặc áp suất.','gas_pressure_if_closed')
add('Oxit axit','''CO2 + 2 NaOH -> Na2CO3 + H2O
CO2 + 2 KOH -> K2CO3 + H2O
CO2 + Ca(OH)2 -> CaCO3 + H2O
Na2CO3 + CO2 + H2O -> 2 NaHCO3
CaCO3 + CO2 + H2O -> Ca(HCO3)2''','aqueous_specified_reagent_ratio','Sản phẩm phụ thuộc tỉ lệ CO₂/bazơ; nước vôi có thể đục rồi trong khi CO₂ dư.','irritant')
assert len(ROWS)==100,len(ROWS)
colors={'AgCl':'trắng','AgBr':'vàng nhạt','AgI':'vàng','BaSO4':'trắng','CaCO3':'trắng','Cu(OH)2':'xanh lam','Fe(OH)3':'nâu đỏ','Fe(OH)2':'lục nhạt, có thể oxi hóa trong không khí','Mg(OH)2':'trắng','Zn(OH)2':'trắng','Al(OH)3':'trắng dạng keo'}
for r in ROWS:
 r['precipitate_colors']={k:colors[k] for k in r['products'] if k in colors and r['category']=='Kết tủa'}
 if 'Zn(OH)2' in r['products'] or 'Al(OH)3' in r['products']:r['limitation']='Kết tủa có thể tan trong kiềm dư; engine chỉ tính giai đoạn kết tủa, không dự đoán lượng rắn cuối khi kiềm dư.'
 if 'H3PO4' in r['reactants']:r['limitation']='Chỉ biểu diễn trung hòa hoàn toàn; nếu thiếu bazơ có thể tạo muối axit, không dự đoán phân bố dạng ion.'
path=Path(__file__).resolve().parents[1]/'web/data/reactions100.json'
path.write_text(json.dumps({'schema':'hololab-reactions-1','temperature_model':None,'reactions':ROWS},ensure_ascii=False,indent=2),encoding='utf-8')
print('Wrote',len(ROWS),'reactions')
