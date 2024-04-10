<?php
// Incluir o arquivo de funções
include("functions.php");

// Verificar se o método da requisição é POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Ler o corpo da requisição JSON
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Verificar se os dados foram recebidos corretamente
    if (isset($requestData['name']) && isset($requestData['type_id']) && isset($requestData['price'])) {
        // Aqui você pode realizar as operações desejadas com os dados recebidos
        // Por exemplo, cadastrar o produto no banco de dados
        // Supondo que você tenha uma função chamada cadastrarProduto
        // e deseja passar os parâmetros recebidos para ela
        $produtoId = cadastrarProduto($requestData['name'], $requestData['type_id'], $requestData['price']);

        // Retornar uma resposta em JSON com o ID do produto cadastrado
        echo json_encode(['product_id' => $produtoId]);
    } else {
        // Se algum parâmetro estiver faltando, retornar uma mensagem de erro em formato JSON
        echo json_encode(['error' => 'Parâmetros insuficientes para cadastrar o produto']);
    }
} else {
    // Se o método da requisição não for POST, retornar uma mensagem de erro em formato JSON
    echo json_encode(['error' => 'Método de requisição não suportado']);
}
?>
