<?php
// Incluir o arquivo de funções
include("functions.php");


// Verificar o tipo de request
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Se o método for GET, obter todos os produtos
    $produtos = obterTodosProdutos();
    // Retornar os produtos em formato JSON
    header('Content-Type: application/json');
    echo json_encode($produtos);
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Ler o corpo da requisição JSON
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Verificar se os dados foram recebidos corretamente
    if (isset($requestData['name']) && isset($requestData['type_id']) && isset($requestData['price'])) {
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
