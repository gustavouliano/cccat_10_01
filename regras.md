# Comando criação SQL
psql -d app_branas -f create.sql -U postgres

 1 - Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total
 2 - Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)
 3 - Não deve criar um pedido com cpf inválido (lançar algum tipo de erro)

---------------

## Testes
 1 - Não deve aplicar cupom de desconto expirado
 2 - Ao fazer um pedido, a quantidade de um item não pode ser negativa
 3 - Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez
 4 - Nenhuma dimensão do item pode ser negativa
 5 - O peso do item não pode ser negativo
 6 - Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)
 7 - Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado

## Considere
O valor mínimo é de R$10,00
Por enquanto, como não temos uma forma de calcular a distância entre o CEP de origem e destino, será de 1000 km (fixo)
## Fórmulas do cálculo de Frete
Utilize a fórmula abaixo para calcular o valor do frete

Valor do Frete = distância (km) * volume (m3) * (densidade/100)

Exemplos de volume ocupado (cubagem)

Camera: 20cm x 15 cm x 10 cm = 0,003 m3
Guitarra: 100cm x 30cm x 10cm = 0,03 m3
Geladeira: 200cm x 100cm x 50cm = 1 m3

Exemplos de densidade

Camera: 1kg / 0,003 m3 = 333kg/m3
Guitarra: 3kg / 0,03 m3 = 100kg/m3
Geladeira: 40kg / 1 m3 = 40kg/m3

-----------

## Parte 3
1 - Checkout, salvando os dados no banco.
2 - Gerar o código/número de série do pedido (AAAASSSSSSSS)
3 - Simulação do frete
4 - Validar cupom de desconto
